import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const { Schema } = mongoose;

const pegadaSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    valor: { type: Number, required: true },
    tipo: { type: String, enum: ['entrada', 'saida'], required: true },
    saida: { type: Boolean },
    descricao: { type: String, required: true },
    expire: {
        type: Date,
        required: true,
        default: () => {
            const date = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Pegada = mongoose.model('pegada', pegadaSchema, 'pegada');