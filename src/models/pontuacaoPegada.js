import mongoose from 'mongoose';
const { Schema } = mongoose;

const pontuacaoPegadaSchema = new Schema({
    pontuacaoUser: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Referência ao modelo User
        pontuacao: [
            {
                entrada: { type: Boolean, required: true },
                dataPontuacao: { type: Date, default: Date.now },
                valor: { type: Number, required: true}
            }
        ]
    },
});

export const User = mongoose.model('pontuacaoPegada', pontuacaoPegadaSchema, 'pontuacaoPegada');
