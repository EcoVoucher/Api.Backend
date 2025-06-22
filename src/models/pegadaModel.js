import mongoose from 'mongoose';
const { Schema } = mongoose;

const pegadaSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    pontuacoes: [{
        pontuacao: { type: Number, required: true },
        data: { type: Date, required: true },
    }],
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: { data: 'data', updatedAt: 'updated_at' } });

export const Pegada = mongoose.model('pegada', pegadaSchema, 'pegada');
