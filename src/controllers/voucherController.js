import { Company } from '../models/userModel.js';
import {Voucher} from '../models/voucherModel.js';

export async function getVoucher(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para listar todos os vouchers'
    */
    try {
        // Busca todos os vouchers válidos (dataValidade no futuro) e popula informações da empresa
        const now = new Date();
        const vouchers = await Voucher.find({
            dataValidade: { $gte: now },
            disponiveis: { $exists: true, $not: { $size: 0 } } // Garante que disponiveis não está vazio
        }).populate('idCompany');

        const result = vouchers.map(voucher => {
            const company = voucher.idCompany || {};
            console.log(company)
            return {
                idLote: voucher._id,
                tipo: voucher.tipo,
                produtos: voucher.produtos,
                empresa: company.nome || company.razaoSocial || 'Empresa',
                endereco: company.endereco.endereco || '',
                cep: company.endereco.cep || '',
                //endereco: company.endereco || '',
                numero: company.endereco.numero || '',
                bairro: company.endereco.bairro || '',
                cidade: company.endereco.cidade || '',
                estado: company.endereco.estado || '',

                validade: voucher.dataValidade ? new Date(voucher.dataValidade).toISOString() : '',
                quantidade: voucher.quantidade,
                codigos: voucher.codigos || []
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao listar vouchers:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}

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
    const { tipo, produtos, quantidade, dataValidade } = req.body;
    const { cnpj } = req.usuario;

    const produtosPorTipo = {
        Alimentacao: ['Arroz', 'Feijao', 'Macarrao'],
        Higiene: ['Sabonete', 'Shampoo', 'Pasta de Dente'],
        Transporte: ['Bilhete Unico', 'Vale Combustivel']
    };

    if (!cnpj || !tipo || !produtos || !quantidade || !dataValidade) {
        return res.status(400).json({ error: true, message: 'Todos os campos obrigatórios devem ser fornecidos: cnpj, tipo, produtos, quantidade, dataValidade' });
    }

    // Validação: produtos pertencem ao tipo do voucher
    const produtosValidos = produtosPorTipo[tipo] || [];
    const produtosInvalidos = produtos.filter(p => !produtosValidos.includes(p));
    if (produtosInvalidos.length > 0) {
        return res.status(400).json({ error: true, message: `Os seguintes produtos não pertencem ao tipo ${tipo}: ${produtosInvalidos.join(', ')}` });
    }

    // Validação: quantidade positiva e inteira
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return res.status(400).json({ error: true, message: 'A quantidade deve ser um número inteiro positivo.' });
    }

    try {
        const company = await Company.findOne({ cnpj: cnpj });
        if (!company) {
            return res.status(404).json({ error: true, message: 'Empresa não encontrada para o CNPJ informado.' });
        }

        // Gerar códigos únicos para cada voucher do lote no formato solicitado
        const generatedCodes = new Set();
        while (generatedCodes.size < quantidade) {
            // Exemplo de código: VCH-2025-b1c2-9f4a
            const ano = new Date(dataValidade).getFullYear();
            const code = `VCH-${ano}-${Math.random().toString(16).substr(2, 4)}-${Math.random().toString(16).substr(2, 4)}`;
            generatedCodes.add(code);
        }
        const codigos = Array.from(generatedCodes).map(codigo => ({
            codigo,
            status: 'valido'
        }));

        // Cria um lote de vouchers (um documento para o lote)
        const voucherBatch = new Voucher({
            idCompany: company._id,
            tipo: tipo,
            produtos: produtos,
            quantidade: quantidade,
            dataValidade: dataValidade,
            codigos: codigos, // salva array de objetos conforme esperado pelo schema
            disponiveis: codigos.map(c => c.codigo) // Inicialmente todos disponíveis
        });
        await voucherBatch.save();

        // Monta o objeto de resposta conforme solicitado
        const lote = {
            idLote: codigos[0].codigo,
            quantidade: quantidade,
            dataValidade: dataValidade,
            empresa: company.nome || company.razaoSocial || 'Empresa',
            endereco: company.endereco || '',
            tipo: tipo,
            produtos: produtos,
            codigos: codigos,
            criadoEm: voucherBatch.createdAt || new Date().toISOString()
        };

        return res.status(201).json({ mensagem: 'Vouchers gerados com sucesso', lote });
    } catch (error) {
        console.error('Erro ao criar voucher:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}
