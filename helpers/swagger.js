import swaggerAutogen from 'swagger-autogen';
({ openapi: '3.1.0'})

const doc = {
    info: {
        title: 'EcoVoucher',
        version: '1.0.0',
        description: 'API para o EcoVoucher',
    },
    servers: [{ url: 'http://localhost:3000' }],
    definitions: {
        Users: {
            cpf: '12345678900',
            nome: 'João Pedro',
            dataNascimento: { type: Date },
            email: 'ecovoucher.dev@gmail.com',
            senha: 'teste@11',
            telefone: '159999999999',
            endereco: {
                cep: '18000000',
                endereco: 'R. Teste',
                numero: '1700',
                complemento: 'bl. 1 apto. 1',
                bairro: 'Jd. Teste',
                cidade: 'Sorocaba',
                estado: 'SP'
            },
            soma_pegada: 209
        },
        Companys: {
            cnpj: '12345678900000',
            nomeEmpresa: 'EcoVoucher',
            email: 'ecovoucher.dev@gmail.com',
            senha: 'teste@11',
            telefone: '159999999999',
            endereco: {
                cep: '18000000',
                endereco: 'R. Teste',
                numero: '1700',
                complemento: 'bl. 1 apto. 1',
                bairro: 'Jd. Teste',
                cidade: 'Sorocaba',
                estado: 'SP'
            },
        },
        Contatos: {
            name: 'João Pedro',
            email: 'ecovoucher.dev@gmail.com',
            telefone: '15999',
            tipo: {
                '@enum': [
                    0,
                    1,
                    2
                ]
            },
            mensagem: 'Teste de mensagem',
            dataEnvio: new Date()
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
