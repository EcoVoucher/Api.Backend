const cnpj = require('@julioakira/cpf-cnpj-utils').CNPJ;
const request = require('supertest');

const baseURL = 'http://localhost:4000/api';
let idEmpresa = null;

describe('API REST de Usuarios sem o Token', () => {
    it('GET /usuarios - Lista todos os prestadores sem o token', async () => {
        const response = await request(baseURL)
            .get('/usuarios')
            .set('Content-Type', 'application/json')
            .expect(401); // Forbidden
    });
});

describe('API REST de Usuarios com o token', ()=> {
    let token //Armazenaremos o access_token JWT
    it('POST - Autenticar usuário para retornar token JWT', async() => {
        const senha = process.env.SENHA_USUARIO
        const response = await request(baseURL)
        .post('/auth/login')
        .set('Content-Type','application/json')
        .send({"cpfOuCnpj":"09.638.714/0001-02","senha": "teste@11"})
        .expect(200) //OK
   
        token = response.body.token
        expect(token).toBeDefined() // Recebemos o token?
    })
    let usuarios = null;
    it('GET - Listar os usuários com autenticação', async() => {
        const response = await request(baseURL)
        .get('/usuarios')
        .set('Content-Type','application/json')
        .set('access-token', token) //Inclui o token na chamada
        .expect(200)

        usuarios = response.body
        expect(usuarios).toBeInstanceOf(Array)
    })

    dadosEmpresa = {
        "nomeEmpresa": "João Pedro",
        "cnpj": cnpj.Generate(true),
        "email": "joao@joao.com",
        "senha": "123456",
        "telefone": 15981212171,
        "cep": 18050000,
        "endereco": "Av armando pannunzio",
        "numero": 1700,
        "complemento": "apto",
        "bairro": "jd vera cruz",
        "cidade": "sorocaba",
        "estado": "sp"
    }

    it('POST - Inclui um nova empresa sem autenticação', async() => {
        const response = await request(baseURL)
        .post('/cadastro/pj')
        .set('Content-Type','application/json')
        .send(dadosEmpresa)
        .expect(201) //Created

        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe("Empresa cadastrada com sucesso")

        idEmpresa = response.body.id
        expect(response.body).toHaveProperty('error')
        expect(typeof response.body.error).toBe('boolean')
    })

    /*it('DELETE - Deleta um usuário com autenticação', async() => {
        const response = await request(baseURL)
        .delete(`/usuarios/${idEmpresa}`)
        .set('Content-Type','application/json')
        .set('access-token', token) //Inclui o token na chamada
        .expect(200) //Created

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('deletedCount')
        expect(response.body.deletedCount).toBeGreaterThan(0)
    })
    */



});
