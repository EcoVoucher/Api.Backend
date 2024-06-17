import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import { createPontuacaoPegada } from '../controllers/pontuacaoPegadaController.js';


router.post('/', auth, createPontuacaoPegada);

export default router;
