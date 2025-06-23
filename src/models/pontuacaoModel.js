import mongoose from 'mongoose';
const { Schema } = mongoose;

const pontuacaoEntradaSchema = new Schema({
    cpf: { type: String, required: true },
    materiais: [
        {
            nome: { type: String, required: true },
            quantidade: { type: Number, required: true },
            pontos: { type: Number, required: true },
            tipo: { type: String, enum: ['papel', 'plastico', 'metal', 'vidro'] },
        }
    ],
    totalPontos: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
    
const pontuacaoSaidaSchema = new Schema({
    cpf: { type: String, required: true },
    materiais: [
        {
            idVoucher: { type: Schema.Types.ObjectId, ref: 'voucher' },
            nome: { type: String, required: true },
            descricao: { type: String },
            quantidade: { type: Number, required: true },
            pontos: {    type: Number, required: true },
            tipo: { type: String, required: true },
        }
    ],
    totalPontos: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// pontuacaoSchema.pre('save', async function(next){// antes de salvar faça isso**
//     // this.senha = await bcrypt.hash(this.senha, 10)// cria uma string alfa numerica - dez rodadas de criptografia é o minimo aceitavel
//     next();
// });


//_id: true,
//idVoucher: { type: Schema.Types.ObjectId, ref: 'voucher' },
//nome: { type: String, required: true },
//descricao: { type: String },
//quantidade: { type: Number, required: true },
//pontos: {    type: Number, required: true },
//tipo: { type: string, required: true },
//

export const PontuacaoEntrada = mongoose.model('pontuacao', pontuacaoEntradaSchema, 'pontuacao');
