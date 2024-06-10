import express from 'express';
import swaggerUi from'swagger-ui-express';
import swaggerFile from "../helpers/swagger-output.json" assert { type: "json" };
import connectDatabase from "./config/dbConnect.js";
import RotasUsuario from './routes/userRoute.js';
import RotasPegada from './routes/pegadaRoute.js';
import {config} from 'dotenv';
config(); // carrega as variáveis do .env

const conexao = await connectDatabase();

conexao.on("error", (erro) => {
    console.error("erro de conexão", erro);
});
conexao.once("open", () => {
    console.log("Conexao com o banco feita com sucesso");
});

const app = express()

app.use(express.json()) //Habilita o parse do JSON
//Rota de conteúdo público
app.use('/', express.static('public'))
//Removendo o x-powered-by por segurança
app.disable('x-powered-by')
//Configurando o favicon
app.use('/favicon.ico', express.static('public/images/favicon.ico'))

//Rota default
app.get('/api', (req, res)=> {
    res.status(200).json({
        message: 'API FATEC 100% funcional🚀',
        version: '1.0.0'
    })
})
//Rotas da API
app.use('/api/user', RotasUsuario)
app.use('/api/pegada', RotasPegada)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rota para a página HTML
app.get('/home', (req, res) => {
    res.redirect('/');
});

export default app;
