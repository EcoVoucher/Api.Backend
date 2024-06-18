const request = require('supertest');

const baseURL = 'http://localhost:3000/api/pontuacao_pegada';

describe('API REST de Pontuação da pegada com o Token', () => {
    it('POST / - Lista todos os prestadores sem o token', async () => {
        const response = await request(baseURL)
            .get('/user')
            .set('Content-Type', 'application/json')
            .expect(401); // Forbidden
    })
});
