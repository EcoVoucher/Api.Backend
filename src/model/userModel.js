import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    cpf: { type: String},
    nome: { type: String },
    dataNascimento: { type: Date },
    email: { type: String },
    senha: { type: String },
    telefone: { type: String },
    endereco: {
        cep: { type: String },
        endereco: { type: String },
        numero: { type: String },
        complemento: { type: String },
        bairro: { type: String },
        cidade: { type: String },
        estado: { type: String }
    },
    // comments: [{ body: String, date: Date }],
    // date: { type: Date, default: Date.now },
    // hidden: Boolean,
    // meta: {
    //     votes: Number,
    //     favs: Number
    // }
});

const companySchema = new Schema({
    cnpj: { type: String, required: true },
    nomeEmpresa: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: {
        cep: { type: String, required: true },
        endereco: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String, required: true },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true }
    },
});



export const User = mongoose.model('user', userSchema, 'user');
export const Company = mongoose.model('company', companySchema, 'user');
