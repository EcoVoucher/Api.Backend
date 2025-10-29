const request = require('supertest');

const baseURL = 'http://localhost:3000/api/vouchers';

describe('API REST de Usuarios sem o Token', () => {
    it('GET /disponiveis - Lista todos os voucher disponiveis sem o token', async () => {
        const response = await request(baseURL)
            .get('/disponiveis')
            .set('Content-Type', 'application/json')
            .expect(401); 
    });

});
