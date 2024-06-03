import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

const router = express.Router()
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'user'

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
export async function getUser(req, res) {
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
        console.log(process.env.secretKey);
        jwt.sign(
            { user: {id: user._id} },
            process.env.secretKey,
            { expiresIn: process.env.EXPIRES_IN },
            (err, token) => {
                console.log(err)
                if (err) throw err

                res.status(200).json({
                    access_token: token,
                    auth: true
                })
            }
        )

        ;
    } catch (err) {
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
}


export async function updateUser(req, res) {
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
}

export async function deleteUser(req, res) {
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
}
