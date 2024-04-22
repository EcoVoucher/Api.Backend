import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'
import var_dump from 'var_dump';

const router = express.Router()
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'user'


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




function comparativo(soma) {
    let comparativo = "";
    if (soma <= 150) {
        comparativo = "É menor que 4 gha, equivalente à dos E.U.A.";
    } else if (soma <= 400) {
        comparativo = "Está entre 4 e 6 gha, equivalente à da França";
    } else if (soma <= 600) {
        comparativo = "Está entre 6 e 8 gha, equivalente à da Suécia";
    } else if (soma <= 800) {
        comparativo = "Está entre 8 e 10 gha, padrão Brasil";
    } else {
        comparativo = "É maior que 10 gha, dentro da média mundial";
    }

    return comparativo;
}

/**
 * GET /api/prestadores
 * Lista todos os prestadores de serviço
 * Parâmetros: limit, skip e order
 */
router.get('/', async (req, res) => {
    const { limit, skip, order } = req.query //Obter da URL
    const somaPegada = req.body.soma;

    try {
        const results = []

        await db.collection(nomeCollection)
        .find()
        .limit(parseInt(limit) || 10)
        .skip(parseInt(skip) || 0)
        .sort({ order: 1 })
        .forEach((doc) => {
            doc.comparativo = comparativo(doc.soma_pegada);
            results.push(doc);
        });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao obter a listagem dos prestadores',
            error: `${err.message}`
        });
    }
});

router.post('/login', validaLogin, async (req, res) => {
    let {identidade, senha} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    identidade = identidade.replace(/[^\d]/g, ''); // Remover caracteres não numéricos

    try {
        let user = await db.collection(nomeCollection).findOne({cpf: identidade, senha: senha});
        if (!user) {
            return res.status(401).send(false);
        }

        return res.status(200).json({
            auth: true,
            _id: user._id,
        });
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao efetuar o login'
            }]
        })
    }
});

router.post('/cadastro', validaCadastro, async (req, res) => {
    let {nome, cpf, cnpj, nomeEmpresa, dataNascimento, email, senha, telefone, cep, endereco, numero, complemento} = req.body;
    cpf = cpf.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    try {
        let user = null;
        if (cpf) {
            user = await db.collection(nomeCollection).findOne({cpf: parseInt(cpf)});
            if (user) {
                return res.status(409).json({error: true, message: 'CPF já cadastrado'});
            }
            user = await db.collection(nomeCollection).insertOne({
                nome: nome,
                cpf: parseInt(cpf),
                dataNascimento:  new Date(dataNascimento),
                email: email,
                senha: senha,
                telefone: parseInt(telefone),
                cep: parseInt(cep),
                endereco: endereco,
                numero: parseInt(numero),
                complemento: complemento
            });
        } else {
            user = await db.collection(nomeCollection).insertOne({
                cnpj: cnpj,
                nomeEmpresa: nomeEmpresa,
                email: email,
                senha: senha,
                telefone: telefone,
                cep: cep,
                endereco: endereco,
                numero: numero,
                complemento: complemento
            });
        }
        if (!user.insertedId) {
            return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
        }

        return res.status(201).json({error: false, message: 'Usuário cadastrado com sucesso', _id: user.insertedId});
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao efetuar o cadastro'
            }]
        })
    }
});


router.put('/alterar_pegada', validaCadastro, async (req, res) => {
    let {token, soma_pegada} = req.body;

    try {
        let user = await db.collection(nomeCollection).findOne({_id: new ObjectId(token)});
        if (!user) {
            return res.status(404).json({error: true, message: 'Usuário não encontrado!'});
        }
        user = await db.collection(nomeCollection).updateOne({_id: new ObjectId(token)}, {$set: {soma_pegada: soma_pegada}});
        if (!user) {
            return res.status(500).json({error: true, message: 'Erro ao alterar a pegada ecológica'});
        }

        return res.status(200).json({error: false, message: 'Pegada ecológica alterada com sucesso'});
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao alterar a pegada ecológica'
            }]
        })
    }
});

router.delete('/:id', async(req, res) => {
    const result = await db.collection(nomeCollection).deleteOne({
        "_id": { $eq: new ObjectId(req.params.id)}
    })
    if (result.deletedCount === 0){
        res.status(404).json({
            errors: [{
                value: `Não há nenhum usuário com o id ${req.params.id}`,
                msg: 'Erro ao excluir o usuário',
                param: '/:id'
            }]
        })
    } else {
        res.status(200).send(result)
    }
});

/**
 * GET /api/prestadores/id/:id
 * Lista o prestador de serviço pelo id
 * Parâmetros: id
 */
router.get('/id/:id', async (req, res) => {
    try {
        const docs = []
        await db.collection(nomeCollection)
        .find({ '_id': { $eq: new ObjectId(req.params.id) } }, {})
        .forEach((doc) => {
            docs.push(doc)
        })
        res.status(200).json(docs)
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter o prestador pelo ID',
                param: '/id/:id'
            }]
        })
    }
})
/**
 * GET /api/prestadores/razao/:filtor
 * Lista o prestador de serviço pela razão social
 * Parâmetros: filtro
 */
router.get('/razao/:filtro', async (req, res) => {
    try {
        const filtro = req.params.filtro.toString()
        const docs = []
        await db.collection(nomeCollection)
        .find({
            $or: [
            { 'razao_social': { $regex: filtro, $options: 'i' } },
            { 'nome_fantasia': { $regex: filtro, $options: 'i' } }
            ]
        })
        .forEach((doc) => {
            docs.push(doc)
        })
        res.status(200).json(docs)
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter o prestador pela razão social',
                param: '/razao/:filtro'
            }]
        })
    }
})
/**
 * DELETE /api/prestadores/:id
 * Remove o prestador de serviço pelo id
 * Parâmetros: id
 */
router.delete('/:id', async(req, res) => {
  const result = await db.collection(nomeCollection).deleteOne({
    "_id": { $eq: new ObjectId(req.params.id)}
  })
  if (result.deletedCount === 0){
    res.status(404).json({
      errors: [{
        value: `Não há nenhum prestador com o id ${req.params.id}`,
        msg: 'Erro ao excluir o prestador',
        param: '/:id'
      }]
    })
  } else {
    res.status(200).send(result)
  }
})

/**
 * POST /api/prestadores
 * Insere um novo prestador de serviço
 * Parâmetros: Objeto prestador
 */

router.post('/', validaPrestador, async(req, res) => {
  try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }
    const prestador =
                 await db.collection(nomeCollection).insertOne(req.body)
    res.status(201).json(prestador) //201 é o status created
  } catch (err){
    res.status(500).json({message: `${err.message} Erro no Server`})
  }
})
/**
 * PUT /api/prestadores
 * Altera um prestador de serviço pelo _id
 * Parâmetros: Objeto prestador
 */
router.put('/', validaPrestador, async(req, res) => {
  let idDocumento = req.body._id //armazenamos o _id do documento
  delete req.body._id //removemos o _id do body que foi recebido na req.
  try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
      const prestador = await db.collection(nomeCollection)
      .updateOne({'_id': {$eq: new ObjectId(idDocumento)}},
                 {$set: req.body})
      res.status(202).json(prestador) //Accepted
  } catch (err){
    res.status(500).json({errors: err.message})
  }
})
export default router
