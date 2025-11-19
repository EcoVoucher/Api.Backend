const cnpj = require('@julioakira/cpf-cnpj-utils').CNPJ;
const cpf = require('@julioakira/cpf-cnpj-utils').CPF;
const request = require('supertest');
const cnpjEmpresa = cnpj.Generate(true).replace(/[.\-]/g, '');
const cpfUsuario = cpf.Generate(true).replace(/[.\-]/g, '');
const baseURL = 'http://localhost:3000/api';
let idEmpresa = null;
let idUsuario = null;



dadosUsuario = {
    "nome": "Silva",
    "cpf": cpfUsuario,
    "dataNascimento": "2003-02-27",
    "email": "pietro_mendes_test@lavabit.com",
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

describe('API REST de Usuarios sem o Token', () => {
    it('GET /usuarios - Lista todos os prestadores sem o token', async () => {
        const response = await request(baseURL)
            .get('/usuarios')
            .set('Content-Type', 'application/json')
            .expect(401); // Forbidden
    });
    dadosEmpresa = {
        "nomeEmpresa": "Empresa de Teste LTDA",
        "cnpj": cnpjEmpresa,
        "email": "joao@joao.com",
        "senha": "123456",
        "telefone": 6438870349,
        "cep": 75711311,
        "endereco": "Praça da Liberdade",
        "numero": 441,
        "complemento": "teste",
        "bairro": "Vila Liberdade",
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


        expect(response.body).toHaveProperty('error')
        expect(typeof response.body.error).toBe('boolean')
    })


    it('POST - Inclui um usuario sem autenticação', async() => {
            const response = await request(baseURL)
            .post('/cadastro/pf')
            .set('Content-Type','application/json')
            .send(dadosUsuario)
            .expect(201) //OK

            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe("Usuário cadastrado com sucesso")

            expect(response.body).toHaveProperty('error')
            expect(typeof response.body.error).toBe('boolean')
    })


    it('POST - Inclui um usuario sem autenticação já existente', async() => {
            const response = await request(baseURL)
            .post('/cadastro/pf')
            .set('Content-Type','application/json')
            .send(dadosUsuario)
            .expect(409) //Conflict

            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe("CPF já cadastrado")

            expect(response.body).toHaveProperty('error')
            expect(typeof response.body.error).toBe('boolean')
    })





});

describe('API REST de Usuarios com o token', ()=> {
    let token //Armazenaremos o access_token JWT
    it('POST - Autenticar usuário para retornar token JWT', async() => {
        const senha = process.env.SENHA_USUARIO
        const response = await request(baseURL)
        .post('/auth/login')
        .set('Content-Type','application/json')
        .send({"cpfOuCnpj": dadosUsuario.cpf,"senha": "teste@11"})
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


//   it('PATCH - Aprovar PJ autenticação', async() => {
//         const response = await request(baseURL)
//         .patch('/admin/aprovar-pj')
//         .set('Content-Type','application/json')
//         .set('access-token', token)
//         .send({
//             "cnpj": cnpjEmpresa
//         }) //Inclui o token na chamada
//         .expect(200)

//         expect(response.body).toHaveProperty('message')
//         expect(response.body.message).toBe("Empresa aprovada com sucesso!")

//         expect(response.body).toHaveProperty('error')
//         expect(typeof response.body.error).toBe('boolean')

//     })

     it('GET - Aprovar PJ autenticação - Empresa não encontrada', async() => {
        const response = await request(baseURL)
        .patch('/admin/aprovar-pj')
        .set('Content-Type','application/json')
        .set('access-token', token)
        .send({
            "cnpj": "1111111111111111"
        }) //Inclui o token na chamada
        .expect(404)

        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe("Empresa não encontrada!")

        expect(response.body).toHaveProperty('error')
        expect(typeof response.body.error).toBe('boolean')

    })

   it('GET - Buscar Usuario', async() => {
            const response = await request(baseURL)
            .get('/usuarios/' + dadosUsuario.cpf)
            .set('Content-Type','application/json')
            .set('access-token', token)
            .expect(200) //OK

            expect(response.body).toHaveProperty('_id')
            idUsuario = response.body._id

            expect(response.body).toHaveProperty('nome')
            expect(response.body.nome).toBe(dadosUsuario.nome)
    })

    it('POST - Alterar Senha usuario ', async() => {
            const response = await request(baseURL)
            .post('/usuarios/alterar-senha')
            .set('Content-Type','application/json')
            .set('access-token', token)
            .send({

                "cpfOuCnpj": cpfUsuario,
                "senhaAtual": "teste@11",
                "novaSenha": "teste@22"

            })
            .expect(200) //OK

             expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe("Senha alterada com sucesso.")

            expect(response.body).toHaveProperty('error')
            expect(typeof response.body.error).toBe('boolean')
    })

    it('POST - Alterar Senha usuario - Erro senha atual incorreta ', async() => {
            const response = await request(baseURL)
            .post('/usuarios/alterar-senha')
            .set('Content-Type','application/json')
            .set('access-token', token)
            .send({
                "cpfOuCnpj": cpfUsuario,
                "senhaAtual": "teste@111",
                "novaSenha": "teste@22"

            })
            .expect(401) //OK

             expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe("Senha atual incorreta.")

            expect(response.body).toHaveProperty('error')
            expect(typeof response.body.error).toBe('boolean')
    })

   it('DELETE - Deletar Usuario', async() => {
            const response = await request(baseURL)
            .delete('/' + idUsuario)
            .set('Content-Type','application/json')
            .set('access-token', token)
            .expect(200) //OK

            expect(response.body).toHaveProperty('acknowledged')
            expect(typeof response.body.acknowledged).toBe('boolean')
            idUsuario = response.body._id

            expect(response.body).toHaveProperty('deletedCount')
            expect(response.body.deletedCount).toBeGreaterThan(0)
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
    })*/

});
