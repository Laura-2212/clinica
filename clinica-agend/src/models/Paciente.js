import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.models.Paciente || mongoose.model('Paciente', PacienteSchema);