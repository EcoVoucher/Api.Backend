import express from 'express';
import swaggerUi from'swagger-ui-express';
import connectDatabase from "./config/dbConnect.js";
import RotasUsuario from './routes/userRoute.js';
import RotasPegada from './routes/pegadaRoute.js';
import RotasPontuacao from './routes/pontuacaoRoute.js';
import RotasVoucher from './routes/voucherRoute.js';
import * as fs  from 'fs';
import { exec } from 'child_process';
import path from 'path';
import {config} from 'dotenv';
import auth from './middlewares/auth.js';
import { sendEmail } from './controllers/emailController.js';
config(); // carrega as variáveis do .env

const conexao = await connectDatabase();

const app = express()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permitir todas as origens, use '*' ou especifique domínios
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Métodos permitidos
    res.header('Access-Control-Allow-Headers', '*'); // Cabeçalhos permitidos

    // Para interceptar requisições OPTIONS (pré-vôo)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});
app.use(express.json()) //Habilita o parse do JSON
//Rota de conteúdo público
app.use('/', express.static('public'), /* #swagger.ignore = true */)
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


// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
//Rotas da API
app.post('/api/email', sendEmail);
app.use('', RotasUsuario)
app.use('/api', RotasUsuario)
app.use('/api', RotasPontuacao)

app.use('/api/pegada', RotasPegada)
app.use('/api/vouchers', RotasVoucher)
app.post('/api/data', (req, res) => {
    const data = req.body;
    // Process the data here
    res.status(200).json({ message: 'Data received successfully', data });
});
app.post('/api/auth', auth, (req, res) => {
    res.status(200).json({auth: true});
});
app.use('/docs', swaggerUi.serve, async (req, res) => {
    try {
        // Verifica se o arquivo swagger-output.json existe
        await fs.promises.access("./helpers/swagger-output.json", fs.constants.F_OK);

        // Se o arquivo já existir, faz a leitura e continua com a configuração do Swagger UI
        fs.readFile('./helpers/swagger-output.json', 'utf-8', (readFileErr, snapshot) => {
            if (readFileErr) {
                console.error('Erro ao ler o arquivo existente:', readFileErr);
                return res.status(500).json({ error: 'Erro ao ler o arquivo existente' });
            }

            const swaggerFile = JSON.parse(snapshot);
            swaggerUi.setup(swaggerFile);
            return res.status(200).send(swaggerUi.generateHTML(swaggerFile));
        });
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Se o arquivo não existir, inicia o processo para gerá-lo
            exec("npm run swagger", (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro: ${error.message}`);
                    return res.status(500).send('Erro ao executar geração do Swagger');
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return res.status(500).send('Erro ao executar geração do Swagger');
                }
                console.log(`Stdout: ${stdout}`);

                // Após a geração bem-sucedida do arquivo, faça a leitura e continue com a configuração do Swagger UI
                fs.readFile('./helpers/swagger-output.json', 'utf-8', (readFileErr, snapshot) => {
                    if (readFileErr) {
                        console.error('Erro ao ler o arquivo gerado:', readFileErr);
                        return res.status(500).send('Erro ao ler o arquivo gerado');
                    }

                    const swaggerFile = JSON.parse(snapshot);
                    swaggerUi.setup(swaggerFile);
                    return res.status(200).send(swaggerUi.generateHTML(swaggerFile));
                });
            });
        }
        console.error('Erro ao verificar a existência do arquivo:', err);
        return res.status(500).send('Erro ao verificar a existência do arquivo');
    }


});

// // Rota para a página HTML
// app.get('/home', (req, res) => {
//     // #swagger.ignore = true
//     res.redirect('/');
// });


app.use((req, res, next) => {
    res.status(404).json({
        error: true,
        message: 'Endpoint não encontrado. Verifique a URL ou consulte a documentação.'
    });
});
export default app;
