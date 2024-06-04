import express from 'express'
import connectDatabase from '../config/dbConnect.js'
import { check, validationResult } from 'express-validator'
import {
    deletePegada,
    getPegadaByRazao,
    getPegadaById,
    getPegada,
} from '../controller/pegadaController.js';
import auth from '../middleware/auth.js';

const router = express.Router();


/**
 * GET /api/prestadores
 * Lista todos os prestadores de serviço
 * Parâmetros: limit, skip e order
 */
router.get('/', auth, getPegada);

/**
 * GET /api/prestadores/id/:id
 * Lista o prestador de serviço pelo id
 * Parâmetros: id
 */
router.get('/id/:id', auth, getPegadaById);

/**
 * GET /api/prestadores/razao/:filtor
 * Lista o prestador de serviço pela razão social
 * Parâmetros: filtro
 */
router.get('/razao/:filtro', auth, getPegadaByRazao);

/**
 * DELETE /api/prestadores/:id
 * Remove o prestador de serviço pelo id
 * Parâmetros: id
 */
router.delete('/:id', auth, deletePegada);

export default router
