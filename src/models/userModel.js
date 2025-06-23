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
    isAdmin: { type: Boolean, default: false },
    tipo: { type: String, enum: ['pj', 'pf'], required: true, default: 'pf' }, // 'pj' para pessoa jurídica, 'pf' para pessoa física
    pontuacao: { type: Number, default: 0 },
    pontos: { type: Number, default: 0 },
    pegada: { type: Number, default: 0 },
    primeiroAcesso: { type: Boolean, default: true, required: true },
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
    aprovado: { type: Boolean, default: false },
    tipo: { type: String, enum: ['pj', 'pf'], required: true, default: 'pj' },
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
