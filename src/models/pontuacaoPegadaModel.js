import mongoose from 'mongoose';
const { Schema } = mongoose;

const pontuacaoPegadaSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    pontuacao: [
        {
            entrada: { type: Boolean, required: true },
            valor: { type: Number, required: true },
            dataPontuacao: { type: Date, default: Date.now },
        }
    ]
});


const PontuacaoPegada = mongoose.model('pontuacaoPegada', pontuacaoPegadaSchema);

export default PontuacaoPegada;
