import mongoose from 'mongoose';

const MedicoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  especialidade: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Vínculo com conta de usuário
}, { timestamps: true });

export default mongoose.models.Medico || mongoose.model('Medico', MedicoSchema);