import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    cpf: { type: String },
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
});

const user = mongoose.model('user', userSchema);

export default user;
