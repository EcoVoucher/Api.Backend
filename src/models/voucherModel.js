import mongoose from 'mongoose';
const { Schema } = mongoose;

const voucherSchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    tipo: { type: String, enum: ['Alimentacao', 'Higiene', 'Transporte'], required: true },
    produtos: [{ type: String, required:    true }],
    quantidade: { type: Number, required: true },
    dataValidade: { type: Date, required: true },
    codigos: [{
        codigo: { type: String, required: true },
        status: { type: String, required: true }
    }],
    disponiveis: [{ type: String, required: true }],
    pontos: { type: Number, required: true }, // Adiciona o campo pontos
}, { timestamps: true });

export const Voucher = mongoose.model('voucher', voucherSchema, 'voucher');
