// tests/pontuacao.e2e.test.js
const request = require('supertest');

const baseURL = 'http://localhost:3000/api';

describe('API REST de Pontuação com token', () => {
    let token;

    it('POST /auth/login - Autentica e retorna token JWT', async () => {
        const resp = await request(baseURL)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                cpfOuCnpj: '49319136017', // CPF que já existe na base
                senha: 'teste@11',        // ajuste se necessário
            })
            .expect(200);
        token = resp.body.token;
        expect(token).toBeDefined();
    });

    it('POST /depositos - Body inválido -> 400', async () => {
        // Falta cpf / totalPontos / descricao, etc.
        await request(baseURL)
            .post('/depositos')
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .send({ qualquerCoisa: true })
            .expect(400);
    });

    it('POST /depositos - Cria depósito com token -> 202', async () => {
        const nowIso = new Date().toISOString();

        const resp = await request(baseURL)
            .post('/depositos')
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .send({
                cpf: "49319136017",
                materiais: [
                    { nome: "Plástico", "quantidade": 3, "pontos": 10 },
                    { nome: "Vidro", "quantidade": 2, "pontos": 5 }
                ],
                totalPontos: 150
            })
            .expect(202); // controller retorna 202 no sucesso

        // validações essenciais do payload de sucesso
        expect(resp.body).toHaveProperty('status', 'ok');
        expect(resp.body).toHaveProperty('message', 'Depósito registrado com sucesso.');
        expect(resp.body).toHaveProperty('deposito');
        expect(resp.body.deposito).toHaveProperty('codigo');
        expect(resp.body.deposito).toHaveProperty('data');
        expect(resp.body.deposito).toHaveProperty('materiais');
        expect(resp.body.deposito).toHaveProperty('idUser');
        expect(resp.body.deposito).toHaveProperty('descricao', 'Depósito de material');
        expect(resp.body.deposito).toHaveProperty('totalPontos', 150);
        expect(resp.body.deposito).toHaveProperty('dataHora');
    });
});
