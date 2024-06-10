import swaggerAutogen from 'swagger-autogen';
({ openapi: '3.1.0'})

const doc = {
    info: {
        title: 'EcoVoucher',
        version: '1.0.0',
        description: 'API para o EcoVoucher',
    },
    servers: [{ url: 'http://localhost:4000' }],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
