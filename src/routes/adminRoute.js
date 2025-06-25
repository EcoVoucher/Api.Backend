import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import {
    getUser,
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    sendResetCode,
} from '../controllers/userController.js';
import { validaRecuperaSenha } from '../validators/userValidators.js';

/**
   * @swagger
   * tags:
   *   name: User
   *   description: Endpoints de Usuários
   */
// #swagger.tags = ['Users']

export default router;
