/* import mongoose from 'mongoose';
const { Schema } = mongoose;

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

const Company = mongoose.model('user', companySchema);

export default Company;
 */