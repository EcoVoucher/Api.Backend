import express from 'express'
import connectDatabase from '../config/dbConnect.js'
import { check, validationResult } from 'express-validator'
import {
    createPegada,
    getPegadaByCpf,
    getPegadaUltimaPontuacao,
} from '../controllers/pegadaController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();
router.use('',  (req, res, next) => {
    /**
     * @swagger
     * tags:
     *   name: Pegadas
     *   description: Endpoints de Pegadas
     */
    // #swagger.tags = ['Pegadas']

    next();
});
router.get('/:documento', auth, getPegadaUltimaPontuacao);
router.get('/historico/:documento', auth, getPegadaByCpf);
router.post('/salvar', auth, createPegada)
// router.get('/', auth, getPegada);
// router.get('/id/:id', auth, getPegadaById);
// router.get('/razao/:filtro', auth, getPegadaByRazao);
// router.delete('/:id', auth, deletePegada);

export default router
