import PontuacaoPegada from '../models/pontuacaoPegadaModel.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

/**
 * GET /api/user/
 * Lista os usuarios
 * Parâmetros: limit, skip e order
 */
export async function createPontuacaoPegada(req, res) {
    /*
        #swagger.tags = ['Pontuacao Pegada']
        #swagger.description = ''
    */
    let user = null;
    try {
        const token = req.header('access-token');
        const decoded = jwt.verify(token, process.env.secretKey);
        const userId = decoded.user.id;

        user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({error: true, message: 'Usuário não encontrado!'});
        }
    } catch (err) {
        res.status(401).json({
            message: 'Token inválido',
            error: `${err.message}`
        });
    }

    const { entrada, valor } = req.body;
    if (valor <= 0) {
        return res.status(400).json({error: true, message: 'Entrada inválida!'});
    }
    console.log(user._id);
    let pontuacaoPegada = await PontuacaoPegada.findOne({ userId: user._id });
    console.log(pontuacaoPegada);
    if (!pontuacaoPegada) {
        pontuacaoPegada = new PontuacaoPegada({
            userId: user._id,
            pontuacao: [{
                entrada: entrada,
                valor: valor
            }]
        });

        await pontuacaoPegada.save().then(() => {
            console.log('Pontuação de pegada salva com sucesso!');
        }).catch(error => {
            console.error('Erro ao salvar pontuação de pegada:', error);
            return res.status(500).json({error: true, message: 'Erro ao salvar pontuação de pegada'});
        })
    }

    pontuacaoPegada.pontuacao.push({
        entrada: entrada,
        valor: valor,
        dataPontuacao: Date.now()
    });

    pontuacaoPegada = await pontuacaoPegada.updateOne({_id: { $eq: pontuacaoPegada._id }}, pontuacaoPegada);

    return


    new PontuacaoPegada({
        pontuacaoUser: {
            user: user._id,
            pontuacao: [
                {
                    entrada: { type: Boolean, required: true },
                    dataPontuacao: { type: Date, default: Date.now },
                    valor: { type: Number, required: true }
                }
            ]
        },
    }).save().then(() => {
        console.log('Error Login');
    }).catch(error => {
        console.error('Erro ao inserir usuário:', error);
        return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
    });
    PontuacaoPegada.insertMany({})
    //console.log(userId)


    return;


    const { limit, skip, order, cpf, cnpj } = req.query //Obter da URL
    const somaPegada = req.body.soma;

    try {
        const results = []
        let query = null;
        if (cpf) {
            query = { 'cpf': { $exists: true }, 'cnpj': { $exists: false } };
        }
        if (cnpj) {
            query = { 'cpf': { $exists: false }, 'cnpj': { $exists: true } };
        }
        const users = await User
        .find(query)
        .limit(parseInt(limit) || 10)
        .skip(parseInt(skip) || 0)
        .sort({ order: 1 })

        if (users) {
            for (let i = 0; i < users.length; i++) {
                users.forEach((doc) => {
                    doc.comparativo = comparativo(doc.soma_pegada);
                    results.push(doc);
                });
            }
        }

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao obter a listagem dos usuários!',
            error: `${err.message}`
        });
    }
}
