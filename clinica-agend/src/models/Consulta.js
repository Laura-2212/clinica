import mongoose from 'mongoose';

const ConsultaSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true },
  dataHora: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Agendada', 'Confirmada', 'Realizada', 'Cancelada'], 
    default: 'Agendada' 
  }
}, { timestamps: true });

export default mongoose.models.Consulta || mongoose.model('Consulta', ConsultaSchema);