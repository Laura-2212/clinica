import { connectToDatabase } from '@/lib/mongodb';
import { respondWithApiError } from '@/lib/api-error';
import Consulta from '@/models/Consulta';
import Paciente from '@/models/Paciente';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const pacientes = await Paciente.find({}).sort({ nome: 1 });
    return NextResponse.json(pacientes);
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { nome, telefone } = await req.json();
    if (!nome?.trim() || !telefone?.trim()) {
      return NextResponse.json({ error: 'Informe o nome e o telefone do paciente.' }, { status: 400 });
    }

    const novoPaciente = await Paciente.create({ nome, telefone });
    return NextResponse.json(novoPaciente, { status: 201 });
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, nome, telefone } = await req.json();
    if (!id || !nome?.trim() || !telefone?.trim()) {
      return NextResponse.json({ error: 'Informe o paciente, o nome e o telefone.' }, { status: 400 });
    }

    const paciente = await Paciente.findByIdAndUpdate(
      id,
      { nome, telefone },
      { new: true, runValidators: true }
    );
    if (!paciente) {
      return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(paciente);
  } catch (error) {
    return respondWithApiError(error);
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Informe o paciente a remover.' }, { status: 400 });
    }
    if (await Consulta.exists({ paciente: id })) {
      return NextResponse.json(
        { error: 'Não é possível remover um paciente que possui consultas cadastradas.' },
        { status: 409 }
      );
    }

    const paciente = await Paciente.findByIdAndDelete(id);
    if (!paciente) {
      return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Paciente removido.' });
  } catch (error) {
    return respondWithApiError(error);
  }
}