import { User, Company } from '../models/userModel.js';
import { historicoPontuacao } from '../models/pontuacaoModel.js';
import { Voucher } from '../models/voucherModel.js';

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
            const endereco = company.endereco || {};
            return {
                idLote: voucher._id,
                tipo: voucher.tipo,
                produtos: voucher.produtos,
                pontos: voucher.pontos,
                // empresa: company.nomeEmpresa || company.razaoSocial || company.nome || 'Empresa',
                // cep: endereco.cep || '',
                // endereco: endereco || '',
                // numero: endereco.numero || '',
                // bairro: endereco.bairro || '',
                // cidade: endereco.cidade || '',
                // estado: endereco.estado || '',

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
    const { cnpj } = req.usuario;

    if(!cnpj) {
        return res.status(400).json({ error: true, message: 'CNPJ é obrigatório' });
    }

    //cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos do CNPJ
    const company = await Company.findOne({ cnpj: cnpj });
    if(!company) {
        return res.status(409).json({ error: true, message: 'Voucher já existe para este CNPJ' });
    }

    try {
        const vouchers = await Voucher.find({ idCompany: company._id });
        // Mapear para trocar _id por idLote
        const result = vouchers.map(voucher => ({
            idLote: voucher._id,
            tipo: voucher.tipo,
            produtos: voucher.produtos,
            quantidade: voucher.quantidade,
            empresa: company.nome || company.razaoSocial || 'Empresa',
            empresa: company.nome || company.razaoSocial || 'Empresa',
            codigosDisponiveis: voucher.disponiveis || [],
            dataValidade: voucher.dataValidade ? new Date(voucher.dataValidade).toISOString() : '',
            criadoEm: voucher.createdAt,
            pontos: voucher.pontos,
            codigos: voucher.codigos || []
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao buscar o token pelo CNPJ:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}

export async function getVoucherByCpfETipo(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para listar vouchers do usuário pelo CPF e tipo, filtrando pelo CNPJ logado'
    */
    const { cnpj } = req.usuario;
    const { cpf, tipo } = req.query;

    if (!cnpj || !cpf || !tipo) {
        return res.status(400).json({ error: true, message: 'CNPJ, CPF e tipo são obrigatórios.' });
    }

    try {
        // Busca o usuário pelo CPF
        const user = await User.findOne({ cpf: cpf });
        if (!user) {
            return res.status(404).json({ error: true, message: 'Usuário não encontrado.' });
        }

        // Busca o histórico de pontuação do usuário
        const historico = await historicoPontuacao.findOne({ idUser: user._id });
        if (!historico || !historico.movimentacoes || historico.movimentacoes.length === 0) {
            return res.status(404).json({ error: true, message: 'Nenhum voucher encontrado para este usuário.' });
        }

        // Busca a empresa pelo CNPJ logado
        const company = await Company.findOne({ cnpj: cnpj });
        if (!company) {
            return res.status(404).json({ error: true, message: 'Empresa não encontrada para o CNPJ informado.' });
        }

        // Filtra movimentações pelo tipo de voucher
        const movimentacoesFiltradas = historico.movimentacoes.filter(mov => mov.tipoVoucher === tipo);

        if (movimentacoesFiltradas.length === 0) {
            return res.status(404).json({ error: true, message: 'Nenhum voucher encontrado para o tipo informado.' });
        }

        // Busca detalhes dos vouchers gerados pela empresa logada
        const voucherIds = movimentacoesFiltradas.map(mov => mov.idVoucher);
        const vouchers = await Voucher.find({ _id: { $in: voucherIds }, idCompany: company._id }).populate('idCompany');

        // Monta o resultado apenas para vouchers da empresa logada
        const result = movimentacoesFiltradas.map(mov => {
            const voucher = vouchers.find(v => v._id.equals(mov.idVoucher));
            if (!voucher) {
                // Se não encontrar o voucher, retorna um objeto vazio ou com informações mínimas
                return {
                    idLote: mov.idVoucher,
                    tipo: null,
                    produtos: [],
                    empresa: 'Empresa',
                    validade: '',
                    codigo: mov.codigoVoucher,
                    status: mov.status,
                    pontos: null,
                    dataCompra: mov.timestamp
                };
            }
            const companyData = voucher.idCompany || {};
            // Formata o endereço se existir
            let enderecoFormatado = '';
            if (companyData.endereco) {
                console.log(companyData.endereco);
                const { cep, endereco, numero, bairro, cidade, estado } = companyData.endereco;
                enderecoFormatado = [
                    endereco,
                    numero,
                    bairro,
                    cidade,
                    estado,
                    cep
                ].filter(Boolean).join(', ');
            }
            return {
                idLote: voucher._id,
                tipo: voucher.tipo,
                produtos: voucher.produtos,
                empresa: companyData.nomeEmpresa || companyData.razaoSocial || 'Empresa',
                endereco: enderecoFormatado,
                validade: voucher.dataValidade ? new Date(voucher.dataValidade).toISOString() : '',
                codigo: mov.codigoVoucher,
                status: mov.status,
                pontos: voucher.pontos,
                dataCompra: mov.timestamp
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao buscar vouchers por CPF e tipo:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}

export async function getVoucherEstatisticasCnpj(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para obter estatísticas de vouchers adquiridos por CNPJ'
    */
    try {
        const { cnpj } = req.usuario;
        if (!cnpj) {
            return res.status(400).json({ error: true, message: 'CNPJ é obrigatório.' });
        }

        // Busca a empresa pelo CNPJ
        const company = await Company.findOne({ cnpj: cnpj });
        if (!company) {
            return res.status(404).json({ error: true, message: 'Empresa não encontrada para o CNPJ informado.' });
        }

        // Busca todos os vouchers da empresa
        const vouchers = await Voucher.find({ idCompany: company._id });

        // Monta um mapa para contar adquiridos por lote
        const porLote = {};
        let totalComprados = 0;

        for (const voucher of vouchers) {
            // Conta quantos códigos do lote foram comprados
            const adquiridos = (voucher.codigos || []).filter(c => c.status === 'comprado' || c.status === 'utilizado').length;
            porLote[voucher._id] = adquiridos;
            totalComprados += adquiridos;
        }

        return res.status(200).json({
            totalComprados,
            porLote
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas de vouchers:', error);
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
        Alimentacao: {
            produtos: ['Marmitex', 'Arroz 5kg', 'Feijão 1kg', 'Leite integral', 'Cesta básica'],
            pontos: 150
        },
        Higiene: {
            produtos: ['Pasta dental Colgate', 'Sabonete Dove', 'Papel higiênico', 'Shampoo', 'Sabão em barra'],
            pontos: 100
        },
        Transporte: {
            produtos: ['Metrô', 'Ônibus'],
            pontos: 50
        }
    };

    if(!cnpj || !tipo || !produtos || !quantidade || !dataValidade) {
        console.log('Campos obrigatórios não fornecidos:', { cnpj, tipo, produtos, quantidade, dataValidade, pontos });
        return res.status(400).json({ error: true, message: 'Todos os campos obrigatórios devem ser fornecidos: cnpj, tipo, produtos, quantidade, dataValidade' });
    }

    // Validação: produtos pertencem ao tipo do voucher
    const categoria = produtosPorTipo[tipo] || { produtos: [] };
    const pontos = produtosPorTipo[tipo].pontos || 10000;
    const produtosValidos = categoria.produtos;
    const produtosInvalidos = produtos.filter(p => !produtosValidos.includes(p));
    if(produtosInvalidos.length > 0) {
        return res.status(400).json({ error: true, message: `Os seguintes produtos não pertencem ao tipo ${tipo}: ${produtosInvalidos.join(', ')}` });
    }

    // Validação: quantidade positiva e inteira
    if(!Number.isInteger(quantidade) || quantidade <= 0 || quantidade > 20) {
        return res.status(400).json({ error: true, message: 'A quantidade deve ser um número maior que 0 e até 20.' });
    }

    try {
        const company = await Company.findOne({ cnpj: cnpj });
        if(!company) {
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
            disponiveis: codigos.map(c => c.codigo), // Inicialmente todos disponíveis
            pontos: pontos
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
            pontos: pontos,
            criadoEm: voucherBatch.createdAt || new Date().toISOString()
        };

        return res.status(201).json({ message: 'Vouchers gerados com sucesso', lote });
    } catch (error) {
        console.error('Erro ao criar voucher:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}

// Marca um voucher como utilizado (PJ)
export async function utilizarVoucher(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para marcar um voucher como utilizado'
    */
    const { codigo } = req.body;

    if(!codigo) {
        return res.status(400).json({ error: true, message: 'O código do voucher é obrigatório.' });
    }

    try {
        // Procura o voucher que contém o código informado
        // Procura o voucher que contém o código informado na coleção Voucher
        const voucher = await Voucher.findOne({ "codigos.codigo": codigo });
        if(!voucher) {
            return res.status(404).json({ error: true, message: 'Voucher não encontrado para o código informado.' });
        }
        // Busca o histórico do usuário relacionado ao voucher
        const historico = await historicoPontuacao.findOne({
            idUser: req.usuario.id,
            'movimentacoes.codigoVoucher': codigo
        });
        // Encontra o objeto do código dentro do array de códigos do voucher
        const codigoObj = voucher.codigos.find(c => c.codigo === codigo);

        if(!codigoObj || !historico) {
            return res.status(404).json({ error: true, message: 'Código não encontrado no voucher.' });
        }

        if(codigoObj.status === 'utilizado') {
            return res.status(400).json({ error: true, message: 'Este voucher já foi marcado como utilizado.' });
        }

        if(codigoObj.status !== 'comprado') {
            return res.status(400).json({ error: true, message: 'O voucher precisa ser comprado antes de ser utilizado.' });
        }

        // Atualiza o status para 'utilizado'

        codigoObj.status = 'utilizado';

        // Atualiza o status para 'utilizado' também no histórico do usuário
        if (historico && historico.movimentacoes && Array.isArray(historico.movimentacoes)) {
            const mov = historico.movimentacoes.find(m => m.codigoVoucher === codigo && m.status === 'comprado');
            if (mov) {
            mov.status = 'utilizado';
            await historico.save();
            }
        }
        await voucher.save();

        return res.status(200).json({ message: 'Voucher marcado como utilizado com sucesso.', codigo: codigoObj.codigo });
    } catch (error) {
        console.error('Erro ao marcar voucher como utilizado:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}


export async function comprarVoucher(req, res) {
    /*
        #swagger.tags = ['Voucher']
        #swagger.description = 'Endpoint para comprar um voucher'
    */
    let idLote = req.body.vouchers;
    const { cpf } = req.usuario;

    if (!idLote || !cpf) {
        return res.status(400).json({ error: true, message: 'idLote e cpf são obrigatórios' });
    }

    if (!Array.isArray(idLote)) {
        idLote = [idLote];
    }

    const uniqueIds = new Set(idLote);
    if (uniqueIds.size !== idLote.length) {
        return res.status(400).json({
            error: true,
            message: 'Não é permitido comprar vouchers do mesmo lote mais de uma vez na mesma requisição.'
        });
    }

    try {
        const results = [];

        const user = await User.findOne({ cpf });
        if (!user) {
            return res.status(404).json({ error: true, message: 'Usuário não encontrado.' });
        }

        let historico = await historicoPontuacao.findOne({ idUser: user._id });
        if (!historico) {
            historico = new historicoPontuacao({ idUser: user._id, movimentacoes: [] });
        }

        let pontosNecessarios = 0;
        const vouchersParaCompra = [];

        for (const loteId of idLote) {
            const voucher = await Voucher.findOne({ _id: loteId });
            if (!voucher) {
                results.push({ idLote: loteId, sucesso: false, message: 'Voucher não encontrado.' });
                continue;
            }
            vouchersParaCompra.push(voucher);
            pontosNecessarios += voucher.pontos || 0;
        }

        if (user.pontos < pontosNecessarios) {
            return res.status(400).json({
                error: true,
                message: `Pontos insuficientes. Você possui ${user.pontos} pontos e precisa de ${pontosNecessarios} pontos para esta compra.`
            });
        }

        for (const voucher of vouchersParaCompra) {
            const loteId = voucher._id.toString();

            if (!voucher.disponiveis || voucher.disponiveis.length === 0) {
                results.push({ idLote: loteId, sucesso: false, message: 'Não há códigos disponíveis para este voucher.' });
                continue;
            }

            const existeValido = voucher.codigos.some(c => c.status === 'valido');
            if (!existeValido) {
                results.push({ idLote: loteId, sucesso: false, message: 'Não há códigos válidos neste lote.' });
                continue;
            }

            const codigo = voucher.disponiveis[0];
            const codigoObj = voucher.codigos.find(c => c.codigo === codigo);

            if (!codigoObj || codigoObj.status !== 'valido') {
                results.push({ idLote: loteId, sucesso: false, message: 'Código já utilizado ou inválido' });
                continue;
            }

            // Atualiza status
            codigoObj.status = 'comprado';
            voucher.disponiveis = voucher.disponiveis.filter(c => c !== codigo);
            await voucher.save();

            // Deduz pontos
            user.pontos -= voucher.pontos || 0;

            // Registra movimentação
            historico.movimentacoes.push({
                idVoucher: voucher._id,
                codigoVoucher: codigoObj.codigo,
                tipo: 'saida',
                pontos: voucher.pontos || 0,
                descricao: `Compra de voucher do tipo ${voucher.tipo}`,
                tipoVoucher: voucher.tipo,
                status: 'comprado',
                timestamp: new Date()
            });

            results.push({
                idLote: loteId,
                sucesso: true,
                message: 'Voucher comprado com sucesso',
                codigo: codigoObj.codigo
            });
        }

        await user.save();
        await historico.save();

        return res.status(200).json({ resultados: results });
    } catch (error) {
        console.error('Erro ao comprar voucher:', error);
        return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
}

