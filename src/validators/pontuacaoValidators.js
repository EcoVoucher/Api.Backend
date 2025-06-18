import { check, body } from 'express-validator';

export const validaDepositos = [
    check('cpf')
        .isString()
        .custom(async(cnpj, { req }) => {
            if (req === undefined) {
                return;
            }
            let cpf = req.body.cpf.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
            if (cpf.length === 11 && cpf.length !== 0) {
                if (cpf.length !== 11) {
                    throw new Error("O CPF deve ter 11 dígitos");
                }

                // Verificar se todos os dígitos são iguais
                if (/^(\d)\1{10}$/.test(cpf)) {
                    throw new Error("CPF inválido");
                }

                // Calcular o primeiro dígito verificador
                let soma = 0;
                for (let i = 0; i < 9; i++) {
                    soma += parseInt(cpf.charAt(i)) * (10 - i);
                }
                let resto = 11 - (soma % 11);
                let digitoVerificador1 = (resto === 10 || resto === 11) ? 0 : resto;

                // Verificar se o primeiro dígito verificador está correto
                if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
                    throw new Error("CPF inválido");
                }

                // Calcular o segundo dígito verificador
                soma = 0;
                for (let i = 0; i < 10; i++) {
                    soma += parseInt(cpf.charAt(i)) * (11 - i);
                }
                resto = 11 - (soma % 11);
                let digitoVerificador2 = (resto === 10 || resto === 11) ? 0 : resto;

                // Verificar se o segundo dígito verificador está correto
                if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
                    throw new Error("CPF inválido");
                }

                return true; // CPF válido
            }
        }),
    
    check('materiais')
        .isArray({ min: 1 }).withMessage('O campo materias deve ser um array com pelo menos um elemento')
        .notEmpty().withMessage('O campo materias não pode ser vazio'),

    check('totalPontos')
        .not()
        .isEmpty()
        .isNumeric().withMessage('O total de pontos deve ser um número')
];

