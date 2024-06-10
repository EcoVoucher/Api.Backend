import express from 'express';
import swaggerUi from'swagger-ui-express';
import connectDatabase from "./config/dbConnect.js";
import RotasUsuario from './routes/userRoute.js';
import RotasPegada from './routes/pegadaRoute.js';
import RotasContato from './routes/contatoRoute.js';
import * as fs  from 'fs';
import { exec } from 'child_process';
import path from 'path';
import {config} from 'dotenv';
import auth from './middlewares/auth.js';
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
        message: 'EcoVoucher API📲',
        version: '1.0.0'
    })
})
//Rotas da API
app.use('/api/user', RotasUsuario)
app.use('/api/pegada', RotasPegada)
app.use('/api/contato', RotasContato)
app.post('/api/auth', auth, async (req, res) => {
    res.status(200).json({'teste': "teste"})
});
app.use('/docs', swaggerUi.serve, async (req, res) => {
    try {
        // Verifica se o arquivo swagger-output.json existe
        await fs.promises.access("./helpers/swagger-output.json", fs.constants.F_OK);

        // Se o arquivo já existir, faz a leitura e continua com a configuração do Swagger UI
        fs.readFile('./helpers/swagger-output.json', 'utf-8', (readFileErr, snapshot) => {
            if (readFileErr) {
                console.error('Erro ao ler o arquivo existente:', readFileErr);
                res.status(500).send('Erro ao ler o arquivo existente');
                return;
            }

            const swaggerFile = JSON.parse(snapshot);
            swaggerUi.setup(swaggerFile);
            res.status(200).send(swaggerUi.generateHTML(swaggerFile));
        });
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Se o arquivo não existir, inicia o processo para gerá-lo
            exec("npm run swagger", (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return;
                }
                console.log(`Stdout: ${stdout}`);

                // Após a geração bem-sucedida do arquivo, faça a leitura e continue com a configuração do Swagger UI
                fs.readFile('./helpers/swagger-output.json', 'utf-8', (readFileErr, snapshot) => {
                    if (readFileErr) {
                        console.error('Erro ao ler o arquivo gerado:', readFileErr);
                        res.status(500).send('Erro ao ler o arquivo gerado');
                        return;
                    }

                    const swaggerFile = JSON.parse(snapshot);
                    swaggerUi.setup(swaggerFile);
                    res.status(200).send(swaggerUi.generateHTML(swaggerFile));
                });
            });
            return;
        }
        console.error('Erro ao verificar a existência do arquivo:', err);
        res.status(500).send('Erro ao verificar a existência do arquivo');
        return;
    }


});

// Rota para a página HTML
app.get('/home', (req, res) => {
    res.redirect('/');
});

export default app;
