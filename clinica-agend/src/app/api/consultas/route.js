import { connectToDatabase } from '@/lib/mongodb';
import { respondWithApiError } from '@/lib/api-error';
import Consulta from '@/models/Consulta';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const medicoId = searchParams.get('medicoId');
    const query = medicoId ? { medico: medicoId } : {};
    const consultas = await Consulta.find(query)
      .populate('paciente', 'nome telefone')
      .populate('medico', 'nome especialidade')
      .sort({ dataHora: 1 });
    return NextResponse.json(consultas);
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { paciente, medico, dataHora } = await req.json();
    const data = new Date(dataHora);
    if (!paciente || !medico || !dataHora || Number.isNaN(data.getTime())) {
      return NextResponse.json(
        { error: 'Selecione o paciente, o médico e uma data e hora válidas.' },
        { status: 400 }
      );
    }

    const conflito = await Consulta.findOne({
      medico,
      dataHora: data,
      status: { $ne: 'Cancelada' }
    });
    if (conflito) {
      return NextResponse.json(
        { error: 'O médico já possui uma consulta agendada para este horário.' },
        { status: 409 }
      );
    }

    const novaConsulta = await Consulta.create({
      paciente,
      medico,
      dataHora: data,
      status: 'Agendada'
    });
    return NextResponse.json(novaConsulta, { status: 201 });
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();
    const allowedStatuses = ['Agendada', 'Confirmada', 'Realizada', 'Cancelada'];
    if (!id || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Informe uma consulta e um status válido.' }, { status: 400 });
    }

    const consulta = await Consulta.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!consulta) {
      return NextResponse.json({ error: 'Consulta não encontrada.' }, { status: 404 });
    }
    return NextResponse.json(consulta);
  } catch (error) {
    return respondWithApiError(error);
  }
}