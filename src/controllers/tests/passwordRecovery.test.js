const request = require('supertest');
const bcrypt = require('bcrypt');

const baseURL = 'http://localhost:3000/api';

describe('Password Recovery API Tests', () => {
    describe('Password Reset Validation', () => {
        it('Should reject weak passwords in reset', async () => {
            const weakPasswords = ['123', 'password', '123456', 'abcdef', '!@#$%^'];
            
            for (const weakPassword of weakPasswords) {
                const response = await request(baseURL)
                    .post('/user/auth/redefinir-senha')
                    .set('Content-Type', 'application/json')
                    .send({
                        token: '123456',
                        senha: weakPassword
                    });
                
                // Should reject weak password before even checking token
                expect(response.status).toBe(400);
                expect(response.body.error).toBe(true);
                expect(response.body.message).toContain('nova senha deve ter no mínimo 6 caracteres');
            }
        });

        it('Should accept strong passwords in reset', async () => {
            const response = await request(baseURL)
                .post('/user/auth/redefinir-senha')
                .set('Content-Type', 'application/json')
                .send({
                    token: '123456', // This will fail due to invalid token, but password validation should pass
                    senha: 'StrongP@ss1'
                });
            
            // Should pass password validation and fail on token validation
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Token inválido.');
        });

        it('Should require both token and password', async () => {
            const response = await request(baseURL)
                .post('/user/auth/redefinir-senha')
                .set('Content-Type', 'application/json')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toBe('Token e nova senha são obrigatórios.');
        });
    });

    describe('Token Validation', () => {
        it('Should reject invalid token format', async () => {
            const invalidTokens = ['12345', '1234567', 'abcdef', '12a456', ''];
            
            for (const invalidToken of invalidTokens) {
                const response = await request(baseURL)
                    .get(`/user/auth/validar-token/${invalidToken}`)
                    .set('Content-Type', 'application/json');
                
                expect(response.status).toBe(400);
                expect(response.body.error).toBe(true);
                expect(response.body.message).toBe('Token inválido. Deve ser um código numérico de 6 dígitos.');
            }
        });

        it('Should accept valid token format (but return not found)', async () => {
            const response = await request(baseURL)
                .get('/user/auth/validar-token/123456')
                .set('Content-Type', 'application/json');
            
            // Valid format but token doesn't exist
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toBe('Token não encontrado.');
            expect(response.body.valido).toBe(false);
        });
    });

    describe('Password Recovery Request', () => {
        it('Should require valid CPF/CNPJ format', async () => {
            const response = await request(baseURL)
                .post('/user/auth/recuperar-senha')
                .set('Content-Type', 'application/json')
                .send({
                    cpfOuCnpj: '123' // Invalid format
                });
            
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('Should return user not found for valid but non-existent CPF/CNPJ', async () => {
            const response = await request(baseURL)
                .post('/user/auth/recuperar-senha')
                .set('Content-Type', 'application/json')
                .send({
                    cpfOuCnpj: '00000000000' // Valid format but doesn't exist
                });
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(true);
            expect(response.body.message).toBe('Usuário não encontrado!');
        });
    });
});