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
    getUserByCpf,
    resetPassword,
    aprovarPj,
    getUserByCpfOuCnpj,
    getHistoricoUser,
    alterarSenha,
    validateToken,
} from '../controllers/userController.js';
import { validaListaUsuarioPorCpf, validaRecuperaSenha } from '../validators/userValidators.js';

router.use('',  (req, res, next) => {
    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: Endpoints de Usuários
     */
    // #swagger.tags = ['Users']

    next();
});
router.get('/usuarios/', auth, getUser);
router.get('/usuarios/historico/:cpf', auth, getHistoricoUser);
router.get('/usuarios/:cpfOuCnpj', auth, getUserByCpfOuCnpj);
router.get('/usuarios/cpf/:cpf', getUserByCpf);
router.post('/cadastro/pj', createUser);
router.post('/cadastro/pf', createUser);
router.post('/auth/login', loginUser);
router.post('/usuarios/recuperar-senha', auth, alterarSenha)
router.patch('/alterar_pegada', auth, updateUser);
router.patch('/admin/aprovar-pj', auth, aprovarPj);
router.delete('/:id', auth, deleteUser);
router.post('/auth/recuperar-senha', validaRecuperaSenha, sendResetCode)
router.get('/auth/validar-token/:token', validaRecuperaSenha, validateToken)
router.post('/auth/redefinir-senha', validaRecuperaSenha, resetPassword)
router.post('/auth/logout', auth, (req, res) => {
    res.json({ auth: false, token: null });
}
);

export default router;
