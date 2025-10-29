import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import { createVoucher, getVoucher, getVoucherByCnpj, comprarVoucher, utilizarVoucher, getVoucherByCpfETipo, getVoucherEstatisticasCnpj, getVouchers } from '../controllers/voucherController.js';

/**
   * @swagger
   * tags:
   *   name: User
   *   description: Endpoints de Usuários
   */
// #swagger.tags = ['Users']
router.post('/comprar', auth, comprarVoucher);
router.post('/utilizar', auth, utilizarVoucher);
router.post('/', auth, auth, createVoucher);
router.get('/', auth, getVoucherByCnpj);
router.get('/estatisticas', auth, getVoucherEstatisticasCnpj);
router.get('/adquiridos', auth, getVoucherByCpfETipo);
router.get('/disponiveis', auth, getVouchers);
router.get('/validar/:codigo', auth, getVoucher);


export default router;
