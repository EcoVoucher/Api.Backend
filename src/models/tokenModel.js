import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    token: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, default: () => Date.now() + 15 * 60 * 1000 } // 15 minutes in milliseconds
});

export const Token = mongoose.model('token', tokenSchema, 'token');
