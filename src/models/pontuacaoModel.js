import mongoose from 'mongoose';
const { Schema } = mongoose;

const pontuacaoSchema = new Schema({
    cpf: { type: String, required: true },
    materiais: [
        {
            _id: false,
            "nome": { type: String, required: true },
            "quantidade": { type: Number, required: true },
            "pontos": { type: Number, required: true }
        }
    ],
    totalPontos: { type: Number, required: true },
});

// pontuacaoSchema.pre('save', async function(next){// antes de salvar faça isso**
//     // this.senha = await bcrypt.hash(this.senha, 10)// cria uma string alfa numerica - dez rodadas de criptografia é o minimo aceitavel
//     next();
// });

export const Pontuacao = mongoose.model('pontuacao', pontuacaoSchema, 'pontuacao');
