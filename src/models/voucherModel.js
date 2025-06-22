import mongoose from 'mongoose';
const { Schema } = mongoose;

const voucherSchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    tipo: { type: String, enum: ['alimentacao'], required: true },
    produtos: [],
    quantidade: { type: Number, required: true , required: true },
    validade: { type: Date, required: true },
});

export const Voucher = mongoose.model('voucher', voucherSchema, 'voucher');
