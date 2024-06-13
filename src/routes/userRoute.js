import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import {
    getUser,
    getUserById,
    createUser,
    loginUser,
    updateUser,
    deleteUser,
} from '../controllers/userController.js';

/**
   * @swagger
   * tags:
   *   name: User
   *   description: Endpoints de Usuários
   */
// #swagger.tags = ['Users']
router.get('/', auth, getUser);
router.get('/:id', auth,  getUserById);
router.post('/cadastro', createUser);
router.post('/login', loginUser);
router.patch('/alterar_pegada', auth, updateUser);
router.delete('/:id', auth, deleteUser);

export default router;
