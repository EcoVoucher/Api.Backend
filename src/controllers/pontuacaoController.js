import { validationResult } from 'express-validator';
import { Pontuacao } from '../models/pontuacaoModel.js';



/**
 * GET /api/Pontuacao/
 * Lista os usuarios
 * Parâmetros: limit, skip e order
 */
export class PontuacaoController {
    static async getPontuacao(req, res) {
        /*
            #swagger.tags = ['Pontuacao']
            #swagger.description = 'Endpoint para obter a pontuação dos usuários'
        */
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }
        const { limit, skip, order } = req.query;

        try {
            // const pontuacao = await Pontuacao
            //     .find()
            //     .limit(parseInt(limit) || 10)
            //     .skip(parseInt(skip) || 0)
            //     .sort({ order: 1 });


            res.status(200).json(pontuacao);
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao obter a pontuação dos usuários!',
                error: `${err.message}`
            });
        }
    }


    static async postPontuacao(req, res) {
        /*
            #swagger.tags = ['Pontuacao']
            #swagger.description = 'Endpoint para obter a pontuação dos usuários'
        */
        const { limit, skip, order } = req.query;
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()});
        }

        try {
            const newPontuacao = new Pontuacao(req.body);
            newPontuacao.save().then((deposito) => {
                deposito = deposito.toObject();
                deposito.codigo = deposito._id;
                delete deposito._id;
                delete deposito.__v;

                return res.status(201).json({status: 'ok', message: 'Depósito registrado com sucesso.', deposito});
            }).catch(error => {
                console.error('Erro ao inserir deposito:', error);
                return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
            });
        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao obter a pontuação dos deposito!',
                error: `${err.message}`
            });
        }
    }
}

export default PontuacaoController;
