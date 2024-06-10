
import mongoose from 'mongoose';
import { updateData } from '../middlewares/global.middlewares.js';

const ContatoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    telefone: {
        type: String,
        required: true
    },
    tipo: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    mensagem: {
        type: String,
        required: true
    },
    dataEnvio: {
        type: Date,
        default: Date.now
    }
});

ContatoSchema.pre('findOneAndUpdate', updateData);

const Contato = mongoose.model("Contato", ContatoSchema);

export default Contato
