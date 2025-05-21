import express from 'express'
import connectDatabase from '../config/dbConnect.js'
import { check, validationResult } from 'express-validator'
import {
    deletePegada,
    getPegadaByRazao,
    getPegadaById,
    getPegada,
    cadastrarPegada,
} from '../controllers/pegadaController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();


router.get('/', auth, getPegada);
router.get('/id/:id', auth, getPegadaById);
router.get('/razao/:filtro', auth, getPegadaByRazao);
router.post('/', auth, cadastrarPegada)
router.delete('/:id', auth, deletePegada);

export default router
