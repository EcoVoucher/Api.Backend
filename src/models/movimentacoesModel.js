import mongoose from 'mongoose';
const { Schema } = mongoose;

const movimentacaoSchema = new Schema({
    cpf: { type: String, required: true },
    movimentacao: [
        {
            idVoucher: { type: Schema.Types.ObjectId, ref: 'voucher' },
            descricao: { type: String, required: true },
            quantidade: { type: Number, required: true },
            entrada: { type: boolean, required: true },
        }
    ],
    totalPontos: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// movimentacaoSchema.pre('save', async function(next){// antes de salvar faça isso**
//     // this.senha = await bcrypt.hash(this.senha, 10)// cria uma string alfa numerica - dez rodadas de criptografia é o minimo aceitavel
//     next();
// });

export const Pontuacao = mongoose.model('pontuacao', movimentacaoSchema, 'pontuacao');
