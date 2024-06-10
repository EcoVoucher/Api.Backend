import express from "express";
import { contatoCreate, findAll,updateContato,deleteContato,getComplexContato, findContatoById} from '../controllers/contatoController.js'
import {validateContato} from '../middlewares/global.middlewares.js';
import {errorHandler} from '../middlewares/global.middlewares.js';
import {formatDateMiddleware} from '../middlewares/global.middlewares.js';


const route = express.Router();

route.use(formatDateMiddleware);

route.post("/",validateContato,contatoCreate);
route.get('/complex-query', getComplexContato);
route.get("/",findAll);
route.get('/:id',findContatoById);
route.patch("/:id",validateContato, updateContato);
route.delete('/:id', deleteContato);

route.use(errorHandler);

export default route
