import { check, body } from 'express-validator';

const validaCadastro = [
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
            } else if (cpf.length === 14) {
                return "CNPJ";
            }
        }),
    check('cnpj')
        .custom(async({ req }) => {
            if (req === undefined) {
                return;
            }
            let cnpj = req.body.cnpj.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
            if (cnpj.length == 14 && cnpj.length != 0) {
                var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
                //var c = String(cnpj).replace(/[^\d]/g, '')

                if(cnpj.length !== 14)
                    throw new Error("CNPJ inválido!");

                if(/0{14}/.test(cnpj))
                    throw new Error("CNPJ inválido!");

                for (var i = 0, n = 0; i < 12; n += cnpj[i] * b[++i]);
                if(cnpj[12] != (((n %= 11) < 2) ? 0 : 11 - n))
                    throw new Error("CNPJ inválido!");

                for (var i = 0, n = 0; i <= 12; n += cnpj[i] * b[i++]);
                if(cnpj[13] != (((n %= 11) < 2) ? 0 : 11 - n))
                    throw new Error("CNPJ inválido!");

                return true
            }
        }),
    check('nome')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar o nome')
        .isLength({ min: 3 }).withMessage('O nome deve ter no mínimo 3 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres')
        .isString().withMessage('O nome deve ser uma string'),
    check('email')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar o email')
        .isEmail().withMessage('O email informado é inválido')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres'),
    check('senha')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar a senha')
        .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
        .isLength({ max: 30 }).withMessage('A senha deve ter no máximo 30 caracteres')
        .isString().withMessage('A senha deve ser uma string'),
    check('telefone')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar o telefone')
        .isLength({ min: 10, max: 11 }).withMessage('O telefone deve ter entre 10 e 11 dígitos')
        .isNumeric().withMessage('O telefone deve ter apenas números'),
    check('cep')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar o CEP')
        .isLength({ min: 8, max: 8 }).withMessage('O CEP deve ter 8 dígitos')
        .isNumeric().withMessage('O CEP deve ter apenas números'),
    check('endereco')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar o endereço')
        .isLength({ min: 3 }).withMessage('O endereço deve ter no mínimo 3 caracteres')
        .isLength({ max: 100 }).withMessage('O endereço deve ter no máximo 100 caracteres')
        .isString().withMessage('O endereço deve ser uma string')
];


const validaLogin = [
    check('identidade')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar o cpf/cnpj')
        .custom(async(senha, { req }) => {
            let cpf = req.body.identidade.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
            if (cpf.length === 11) {
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
            } else if (cpf.length === 14) {
                return "CNPJ";
            } else {
                throw new Error("CPF/CNPJ inválido!");
            }
        }),
    check('senha')
        .not()
        .isEmpty()
        .trim().withMessage('É obrigatório informar a senha')
        .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
        .isLength({ max: 30 }).withMessage('A senha deve ter no máximo 30 caracteres')
        .isString().withMessage('A senha deve ser uma string')
];

const validaPrestador = [
check('cnpj')
    .not()
    .isEmpty()
    .trim().withMessage('É obrigatório informar o cnpj')
    .isNumeric().withMessage('O CPF deve ter apenas números')
    .isLength({min:11, max:11}).withMessage('O CNPJ deve ter 14 números'),
check('senha')
    .not()
    .isEmpty()
    .trim().withMessage('É obrigatório informar a senha')
    .isLength({min:6}).withMessage('A senha deve ter no mínimo 6 caracteres')
    .isLength({max: 30}).withMessage('A senha deve ter no máximo 30 caracteres')
]

export const validaRecuperaSenha = [
    
    check('cpf')
        // .not()
        .isEmpty()
        
        .trim().withMessage('É obrigatório informar o cpf')
        // .isEmail().withMessage('O email informado é inválido')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres')
        //check('cnpj')
        .custom(async({ req }) => {
            if (!req || !req.body || !req.body.cnpj) {
                throw new Error("CPF é obrigatório");
            }
            // if (req && req.body) {
            //     console.log(req.body.cnpj);
            // } else {
            //     console.log('req or req.body is undefined');
            // }
            // if(req.body.cpf != undefined && req.body.cnpj != undefined) {
            //     return;
            // }
        })
];