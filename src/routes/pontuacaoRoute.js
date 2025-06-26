import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import pontuacaoController from '../controllers/pontuacaoController.js';
import { validaDepositos } from '../validators/pontuacaoValidators.js';

/**
   * @swagger
   * tags:
   *   name: Deposito
   *   description: Endpoints de Pontuação
   */
// #swagger.tags = ['Deposito']
router.post('/depositos', validaDepositos, pontuacaoController.postPontuacao);

export default router;
