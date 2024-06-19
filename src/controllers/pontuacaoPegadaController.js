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
    let pontuacaoPegada = await PontuacaoPegada.findOne({ userId: user._id });

    if (!pontuacaoPegada) {
        pontuacaoPegada = new PontuacaoPegada({
            userId: user._id,
            pontuacao: [{
                entrada: true,
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

    try {
        pontuacaoPegada = await PontuacaoPegada.findByIdAndUpdate(pontuacaoPegada._id, pontuacaoPegada, { new: true });

        return res.status(201).json({error: true, message: 'Pontuação de pegada salva com sucesso!'});
    } catch (error) {
        return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
    }
}
