import mongoose from 'mongoose';
const { Schema } = mongoose;

const pontuacaoEntradaSchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    materiais: [
        {
            nome: { type: String, required: true },
            quantidade: { type: Number, required: true },
            pontos: { type: Number, required: true },
            tipo: { type: String, enum: ['papel', 'plastico', 'metal', 'vidro'] },
        }
    ],
    totalPontos: { type: Number, required: true },
    descricao: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const historicoPontuacaoSchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    movimentacoes: [
        {
            idVoucher: { type: Schema.Types.ObjectId, ref: 'voucher' },
            tipo: { type: String, enum: ['entrada', 'saida'], required: true },
            pontos: { type: Number, required: true },
            descricao: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            tipoVoucher: { type: String }, // Opcional para saídas
            status: { type: String, enum: ['valido', 'invalido'] },
        }
    ]
});

// const pontuacaoSaidaSchema = new Schema({
//     cpf: { type: String, required: true },
//     materiais: [
//         {
//             idVoucher: { type: Schema.Types.ObjectId, ref: 'voucher' },
//             nome: { type: String, required: true },
//             descricao: { type: String },
//             quantidade: { type: Number, required: true },
//             pontos: {    type: Number, required: true },
//             tipo: { type: String, required: true },
//         }
//     ],
//     totalPontos: { type: Number, required: true },
//     createdAt: { type: Date, default: Date.now },
// });

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

export const Deposito = mongoose.model('pontuacao', pontuacaoEntradaSchema, 'pontuacao');
export const historicoPontuacao = mongoose.model('historico', historicoPontuacaoSchema, 'historico');
