import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import pontuacaoController from '../controllers/pontuacaoController.js';
import { validaDepositos } from '../validators/pontuacaoValidators.js';

/**
   * @swagger
   * tags:
   *   name: Pontuacao
   *   description: Endpoints de Pontuação
   */
// #swagger.tags = ['Pontuacao']
router.post('/depositos', validaDepositos, pontuacaoController.postPontuacao);

export default router;
