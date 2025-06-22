import { Company } from '../models/userModel.js';
import {Voucher} from '../models/voucherModel.js';

export async function getVoucherByCnpj(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para obter o token de um voucher pelo CNPJ'
    */
    const { cnpj } = req.query;

    if (!cnpj) {
        return res.status(400).json({ error: true, message: 'CNPJ é obrigatório' });
    }

    const com = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos do CNPJ
    const company = await Company.findOne({ cnpj: cnpj });
    if(!company) {
        return res.status(409).json({ error: true, message: 'Voucher já existe para este CNPJ' });
    }

    try {
        // Aqui você deve implementar a lógica para buscar o token pelo CNPJ
        // Exemplo fictício:
        const voucher = await Voucher.find({ idCompany: company._id }, {tipo: true, quantidade: true, validade: true});
        console.log('Voucher encontrado:', voucher);

        if (!voucher) {
            return res.status(404).json({ error: true, message: 'Voucher não encontrado' });
        }

        return res.status(200).json(voucher);
    } catch (error) {
        console.error('Erro ao buscar o token pelo CNPJ:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}

export async function createVoucher(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para criar um novo voucher'
    */
    const { cnpj,tipo, produtos, quantidade, dataValidade } = req.body;

    if (!cnpj || !tipo || !produtos || !quantidade || !dataValidade) {
        return res.status(400).json({ error: true, message: 'Todos os campos obrigatórios devem ser fornecidos: cnpj, idUser, tipo, produtos, quantidade, dataValidade' });
    }

    try {
        const existingVoucher = await Company.findOne({ cnpj: cnpj });
        if(!existingVoucher) {
            return res.status(409).json({ error: true, message: 'Voucher já existe para este CNPJ' });
        }

        const voucher = new Voucher({
            idCompany: existingVoucher._id,
            tipo: tipo,
            produtos: produtos,
            quantidade: quantidade,
            dataValidade: dataValidade
        });
        await voucher.save();

        return res.status(201).json({ message: 'Voucher criado com sucesso', voucher });
    } catch (error) {
        console.error('Erro ao criar voucher:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}
