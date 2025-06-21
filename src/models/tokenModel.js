import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    token: { type: String, required: true },
    created_at: { type: Date, default: Date.now }, // Token expira em 1 hora
    expires_at: { type: Date, default: () => Date.now() + 3600000 } // 1 hora em milissegundos
});

export const Token = mongoose.model('token', tokenSchema, 'token');
