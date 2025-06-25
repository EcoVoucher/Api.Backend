import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import { createVoucher, getVoucher, getVoucherByCnpj } from '../controllers/voucherController.js';

/**
   * @swagger
   * tags:
   *   name: User
   *   description: Endpoints de Usuários
   */
// #swagger.tags = ['Users']
router.post('/', auth, auth, createVoucher);
router.get('/', auth, getVoucherByCnpj);
router.get('/disponiveis', auth, getVoucher);


export default router;
