import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    cpf: String,
    nome: String,
    dataNascimento: Date,
    email: String,
    senha: String,
    telefone: String,
    endereco: {
        cep: String,
        endereco: String,
        numero: String,
        complemento: String
    },
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
});
