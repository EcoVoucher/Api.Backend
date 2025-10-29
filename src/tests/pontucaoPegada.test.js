const request = require('supertest');

const baseURL = 'http://localhost:3000/api';

dadosUsuario = {
    "nome": "Vidotto Teste",
    "cpf": "93379299022",
    "dataNascimento": "2003-02-27",
    "email": "pietro_m_teste@lavabit.com",
    "senha": "teste@11",
    "telefone": 15992373208,
    "cep": "18085335",
    "endereco": "Rua Botucatu",
    "numero": 321,
    "complemento": "teste",
    "bairro": "Jardim Leocádia",
    "cidade": "Sorocaba",
    "estado": "SP"
};
let idUsuario = null;


describe('API REST de Pontuação da pegada sem o Token', () => {
    // Cria o usuário antes de todos os testes (não é contabilizado como teste)
    beforeAll(async () => {
        await request(baseURL)
            .post('/cadastro/pf')
            .set('Content-Type','application/json')
            .send(dadosUsuario)
            .expect(201);
    });

    it('GET / - Lista todos os prestadores sem o token', async () => {
        const response = await request(baseURL)
            .get('/pegada/historico/'+ dadosUsuario.cpf)
            .set('Content-Type', 'application/json')
            .expect(401); // Forbidden
    })
});




describe('API REST de Pontuação da pegada com o Token', () => {
        let token //Armazenaremos o access_token JWT
        // Cadastra o usuário antes de autenticar
        
        it('POST - Autenticar usuário para retornar token JWT', async() => {
            const senha = process.env.SENHA_USUARIO
            const response = await request(baseURL)
            .post('/auth/login')
            .set('Content-Type','application/json')
            .send({"cpfOuCnpj":dadosUsuario.cpf,"senha": "teste@11"})
            .expect(200) //OK
       
            token = response.body.token
            expect(token).toBeDefined() // Recebemos o token?
        })
    it('POST / -  Ultimo pontuação com o token mas com CPF inválido', async () => {
            const response = await request(baseURL)
                .post('/pegada/salvar')
                .set('Content-Type', 'application/json')
                .set('access-token', token) // Inclui o token na chamada
                .expect(404); // Not Found
     })

     it('POST / -  Adicioanar  pontuação com o token ', async () => {
            const response = await request(baseURL)
                .post('/pegada/salvar')
                .set('Content-Type', 'application/json')
                .set('access-token', token) 
                .send({
                    "documento": dadosUsuario.cpf,
                    "pontuacao": 300
                })
                .expect(202); // OK
     })

    it('GET / - Listar pontuação com o token', async () => {
        const response = await request(baseURL)
            .get('/pegada/historico/'+ dadosUsuario.cpf)
            .set('Content-Type', 'application/json')
            .set('access-token', token) // Inclui o token na chamada
            .expect(200); // OK

            expect(response.body).toBeInstanceOf(Array)
    })

    it('GET / - Lista historico pontuação com o token mas com CPF inválido', async () => {
            const response = await request(baseURL)
                .get('/pegada/historico/12345678900')
                .set('Content-Type', 'application/json')
                .set('access-token', token) // Inclui o token na chamada
                .expect(404); // Not Found

     })

     it('GET / - Ultimo pontuação com o token', async () => {
            const response = await request(baseURL)
                .get('/pegada/' + dadosUsuario.cpf)
                .set('Content-Type', 'application/json')
                .set('access-token', token) // Inclui o token na chamada
                .expect(200); // OK
     })

    it('GET / -  Ultimo pontuação com o token mas com CPF inválido', async () => {
            const response = await request(baseURL)
                .get('/pegada/12345678900')
                .set('Content-Type', 'application/json')
                .set('access-token', token) // Inclui o token na chamada
                .expect(404); // Not Found
     })

   

     it('POST / -  Ultimo pontuação com o token mas com CPF inválido', async () => {
            const response = await request(baseURL)
                .post('/pegada/salvar')
                .set('Content-Type', 'application/json')
                .set('access-token', token) 
                .send({
                    "documento": "111111111111",
                    "pontuacao": 300
                })
                .expect(404); // Not Found
     })

    // Limpa o usuário após todos os testes (não é contabilizado como teste)
    afterAll(async () => {
        // Busca o ID do usuário
        const responseGet = await request(baseURL)
            .get('/usuarios/' + dadosUsuario.cpf)
            .set('Content-Type','application/json')
            .set('access-token', token)
            .expect(200);
        
        idUsuario = responseGet.body._id;
        
        // Deleta o usuário
        await request(baseURL)
            .delete('/' + idUsuario)
            .set('Content-Type','application/json')
            .set('access-token', token)
            .expect(200);
    });
     
});