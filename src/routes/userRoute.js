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
    sendResetCode,
    getUserByCpf,
    resetPassword,
    aprovarPj,
} from '../controllers/userController.js';
import { validaListaUsuarioPorCpf, validaRecuperaSenha } from '../validators/userValidators.js';

/**
   * @swagger
   * tags:
   *   name: User
   *   description: Endpoints de Usuários
   */
// #swagger.tags = ['Users']
router.get('/usuarios/', auth, getUser);
router.get('/usuarios/:id', auth, getUserById);
router.get('/usuarios/cpf/:cpf', getUserByCpf);
router.post('/cadastro/pj', createUser);
router.post('/cadastro/pf', createUser);
router.post('/auth/login', loginUser);
router.patch('/alterar_pegada', auth, updateUser);
router.patch('/admin/aprovar-pj', auth, aprovarPj);
router.delete('/:id', auth, deleteUser);
router.post('/auth/recuperarSenha', validaRecuperaSenha, sendResetCode)
router.post('/auth/redefinir-senha', validaRecuperaSenha, resetPassword)
router.post('/auth/logout', auth, (req, res) => {
    res.json({ auth: false, token: null });
}
);

export default router;
