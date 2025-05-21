import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const { Schema } = mongoose;

const userSchema = new Schema({
    cpf: { type: String, required: true },
    nome: { type: String, required: true },
    dataNascimento: { type: Date },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    //codigoSeguranca: { type: String }, // Added
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
    soma_pegada: { type: Number }
});

userSchema.pre('save', async function(next){// antes de salvar faça isso**
    this.senha = await bcrypt.hash(this.senha, 10)// cria uma string alfa numerica - dez rodadas de criptografia é o minimo aceitavel
    next();
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
        complemento: { type: String },
        bairro: { type: String },
        cidade: { type: String },
        estado: { type: String }
    },
});

companySchema.pre('save', async function(next){// antes de salvar faça isso**
    this.senha = await bcrypt.hash(this.senha, 10)// cria uma string alfa numerica - dez rodadas de criptografia é o minimo aceitavel
    next();

});

export const User = mongoose.model('user', userSchema, 'user');
export const Company = mongoose.model('company', companySchema, 'company');
