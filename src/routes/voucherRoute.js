import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import { createVoucher, getVoucherByCnpj } from '../controllers/voucherController.js';

/**
   * @swagger
   * tags:
   *   name: User
   *   description: Endpoints de Usuários
   */
// #swagger.tags = ['Users']
router.post('/', createVoucher);
router.get('/', getVoucherByCnpj);


export default router;
