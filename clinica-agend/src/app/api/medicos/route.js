import { connectToDatabase } from '@/lib/mongodb';
import { respondWithApiError } from '@/lib/api-error';
import Consulta from '@/models/Consulta';
import Medico from '@/models/Medico';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const medicos = await Medico.find({}).sort({ nome: 1 });
    return NextResponse.json(medicos);
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { nome, especialidade } = await req.json();
    if (!nome?.trim() || !especialidade?.trim()) {
      return NextResponse.json({ error: 'Informe o nome e a especialidade do médico.' }, { status: 400 });
    }

    const novoMedico = await Medico.create({ nome, especialidade });
    return NextResponse.json(novoMedico, { status: 201 });
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, nome, especialidade } = await req.json();
    if (!id || !nome?.trim() || !especialidade?.trim()) {
      return NextResponse.json({ error: 'Informe o médico, o nome e a especialidade.' }, { status: 400 });
    }

    const medico = await Medico.findByIdAndUpdate(
      id,
      { nome, especialidade },
      { new: true, runValidators: true }
    );
    if (!medico) {
      return NextResponse.json({ error: 'Médico não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(medico);
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Informe o médico a remover.' }, { status: 400 });
    }
    if (await Consulta.exists({ medico: id })) {
      return NextResponse.json(
        { error: 'Não é possível remover um médico que possui consultas cadastradas.' },
        { status: 409 }
      );
    }

    const medico = await Medico.findByIdAndDelete(id);
    if (!medico) {
      return NextResponse.json({ error: 'Médico não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Médico removido.' });
  } catch (error) {
    return respondWithApiError(error);
  }
}