import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';

import {
    getUser,
    getUserById,
    createUser,
    loginUser,
    updateUser,
    deleteUser,
} from '../controller/userController.js';

router.get('/', /* auth, */ getUser);
router.get('/:id', auth,  getUserById);
router.post('/cadastro', createUser);
router.post('/login', loginUser);
router.put('/alterar_pegada', auth, updateUser);
router.delete('/user/:id', auth, deleteUser);

export default router;
