import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import { User, Company } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { validaCpfOuCnpj } from '../validators/Documents.js';
import { EnumDocuments } from '../enums/document.js';
import errorLogin from '../models/errorLoginModel.js';
import { Token } from '../models/tokenModel.js';

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
 * GET /api/user/
 * Lista os usuarios
 * Parâmetros: limit, skip e order
 */
export async function getUser(req, res) {
    /*
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint para obter a listagem de usuários'
    */
    const { limit, skip, order, cpf, cnpj } = req.query //Obter da URL
    const somaPegada = req.body.soma;

    try {
        const results = []
        let query = null;
        if (cpf) {
            query = { 'cpf': { $exists: true }, 'cnpj': { $exists: false } };
        }
        if (cnpj) {
            query = { 'cpf': { $exists: false }, 'cnpj': { $exists: true } };
        }
        const users = await User
        .find(query)
        .limit(parseInt(limit) || 10)
        .skip(parseInt(skip) || 0)
        .sort({ order: 1 })

        if (users) {
            for (let i = 0; i < users.length; i++) {
                users.forEach((doc) => {
                    doc.comparativo = comparativo(doc.soma_pegada);
                    results.push(doc);
                });
            }
        }

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao obter a listagem dos usuários!',
            error: `${err.message}`
        });
    }
}

/**
 * GET /api/prestadores/id/:id
 * Lista o prestador de serviço pelo id
 * Parâmetros: id
 */
export async function getUserByCpf(req, res) {
    try {
        const cpf = req.params.cpf.replace(/[^\d]/g, '');
        if(!validaCpfOuCnpj(cpf) || validaCpfOuCnpj(cpf) !== EnumDocuments.cpf) {
            return res.status(400).json({error: true, message: 'CPF inválido'});
        }

        const doc = await User
            .findOne({ 'cpf': cpf }, {_id: false, cpf: true, nome: true, pontos: 150, email: true});
        console.log(doc)
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ error: true, message: 'Nenhum usuário encontrado com o CPF informado'});
        }
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter o prestador pelo ID',
                param: '/id/:id'
            }]
        })
    }
}

/**
 * GET /api/prestadores/id/:id
 * Lista o prestador de serviço pelo id
 * Parâmetros: id
 */
export async function getUserById(req, res) {
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
}

export async function loginUser(req, res) {
    let {cpfOuCnpj, senha, tipo} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    cpfOuCnpj = cpfOuCnpj.replace(/[^\d]/g, ''); // Remover caracteres não numéricos

    try {
        let isValid = validaCpfOuCnpj(cpfOuCnpj);
        const ipClient = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        if (!isValid) {
            new errorLogin({
                ip: ipClient,
                cpfOuCnpj: cpfOuCnpj,
            }).save().then(() => {
                console.log('Error Login');
            }).catch(error => {
                console.error('Erro ao inserir usuário:', error);
                return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
            });
            return res.status(401).json({error: true, message: 'CPF/CNPJ ou senha incorretos.'});
        }

        let user = null;
        validaCpfOuCnpj(cpfOuCnpj) === EnumDocuments.cpf ? user = await User.   findOne({cpf: parseInt(cpfOuCnpj)}) : user = await Company.findOne({cnpj: parseInt(cpfOuCnpj)});
        const validatePassword = user ? await bcrypt.compare(senha, user.senha) : false;

        if ((!user && !validatePassword) || (user.cnpj != null && !user.aprovado)) {
            new errorLogin({
                ip: ipClient,
                cpfOuCnpj: cpfOuCnpj,
            }).save().then(() => {
                console.log('Error Login');
            }).catch(error => {
                console.error('Erro ao inserir usuário:', error);
                return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
            });
            if(!user.aprovado) {
                return res.status(403).json({error: true, message: 'Cadastro ainda não aprovado.'});
            }
            return res.status(401).json({error: true, message: 'CPF/CNPJ ou senha incorretos.'});
        }
        let usuarioResponse = {
            id: user._id,
            nome: user.nome,
            email: user.email,
        };
        if(user.cpf != null) {
            usuarioResponse.cpf = user.cpf;
            usuarioResponse.primeiroAcesso = user.primeiroAcesso;
            usuarioResponse.tipo = 'pf';

        } else {
            usuarioResponse.cnpj = user.cnpj;
            usuarioResponse.tipo = 'pj';
        }
        jwt.sign(
            { user: {id: user._id} },
            process.env.SECRETKEY,
            { expiresIn: process.env.EXPIRES_IN },
            (err, token) => {
                if (err) throw err

                res.status(200).json({
                    token: token,
                    usuario: usuarioResponse,
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao efetuar o login',
                auth: false
            }]
        })
    }
}

export async function createUser(req, res) {
    let {
        nome,
        cpf,
        cnpj,
        nomeEmpresa,
        dataNascimento,
        email,
        senha,
        telefone,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado
    } = req.body;

    if(cpf) cpf = cpf.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
    if(cnpj) cnpj = cnpj.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    try {
        let user = null;
        if (cpf) {
            user = await User.findOne({cpf: parseInt(cpf)});
            if (user) {
                return res.status(409).json({error: true, message: 'CPF já cadastrado'});
            }

            const newUser = new User({
                nome: nome,
                cpf: parseInt(cpf),
                dataNascimento:  new Date(dataNascimento),
                email: email,
                senha: senha,
                telefone: telefone,
                endereco: {
                    cep: parseInt(cep),
                    endereco: endereco,
                    numero: parseInt(numero),
                    complemento: complemento,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado
                }
            });

            newUser.save().then(() => {
                return res.status(201).json({error: false, message: 'Usuário cadastrado com sucesso'});
            }).catch(error => {
                console.error('Erro ao inserir usuário:', error);
                return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
            });
        } else {
            let company = await Company.findOne({cnpj: parseInt(cnpj)});
            if (company) return res.status(409).json({error: true, message: 'CNPJ já cadastrado'});

            const newCompany = new Company({
                nomeEmpresa: nomeEmpresa,
                cnpj: parseInt(cnpj),
                dataNascimento:  new Date(dataNascimento),
                email: email,
                senha: senha,
                telefone: telefone,
                endereco: {
                    cep: parseInt(cep),
                    endereco: endereco,
                    numero: parseInt(numero),
                    complemento: complemento,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado
                }
            });

            newCompany.save().then(() => {
                return res.status(201).json({error: false, message: 'Empresa cadastrada com sucesso'});
            }).catch(error => {
                console.error('Erro ao inserir empresa:', error);
                return res.status(500).json({error: true, message: 'Erro ao efetuar ao cadastrar empresa'});
            });
        }
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao efetuar o cadastro'
            }]
        })
    }
}


export async function sendResetCode(req, res) {
    // const errors = validationResult(req);
    // console.log(errors)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({ errors: errors.array()})
    // }

    let user = await User.findOne({cpf: parseInt(req.body.cpf.replace(/[^\d]/g, ''))});
    if(!user) {
        return res.status(404).json({error: true, message: 'Usuário não encontrado!'});
    }



    let token = '';
    token = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    try {
        // Verifica se o usuário já possui um token
        let existingToken = await Token.find({ idUser: user._id }).sort().limit(1);
        // if(existingToken) {

        const tokenAge = (Date.now() - new Date(existingToken.created_at).getTime()) / 1000; // em segundos


        if (existingToken) {
            // Atualiza o token existente
            existingToken.token = token;
            existingToken.expires_at = new Date(Date.now() + 3600000); // Define a expiração para 1 hora
            await existingToken.save();
        } else {
            // Cria um novo token

            const newToken = new Token({
                idUser: user._id,
                token: token,

            });
            await newToken.save();
        }

        // Aqui você deve enviar o token para o usuário via email ou outro meio
        console.log(`Código de redefinição enviado para ${user.email}: ${token}`);

        return res.status(200).json({error: false, message: 'Código de redefinição enviado com sucesso!'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: true, message: 'Erro ao enviar o código de redefinição.'});
    }



}

export async function resetPassword(req, res) {}

export async function updateUser(req, res) {
    let {token, soma_pegada} = req.body;
    console.log(token)
    try {
        let user = await User.findOne({_id: {$eq: token}});
        if (!user) {
            return res.status(404).json({error: true, message: 'Usuário não encontrado!'});
        }
        user = await User.updateOne({_id: {$eq: token}}, {$set: {soma_pegada: soma_pegada}});
        if (!user) {
            return res.status(500).json({error: true, message: 'Erro ao alterar a pegada ecológica'});
        }

        return res.status(200).json({error: false, message: 'Pegada ecológica alterada com sucesso'});
    } catch (err) {
        console.error(err)
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao alterar a pegada ecológica'
            }]
        })
    }
}

export async function deleteUser(req, res) {
    const result = await User.deleteOne({ "_id": {$eq: req.params.id} });

    if (result.deletedCount === 0){
        res.status(404).json({
            errors: [{
                value: `Não há nenhum usuário com o id ${req.params.id}`,
                msg: 'Erro ao excluir o usuário',
                param: '/:id'
            }]
        })
    } else {
        res.status(200).send(result);
    }
}
