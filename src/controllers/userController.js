import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import { User, Company } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { validaCpfOuCnpj } from '../validators/Documents.js';
import { EnumDocuments } from '../enums/document.js';
import errorLogin from '../models/errorLoginModel.js';
import { Token } from '../models/tokenModel.js';
import sendEmail, { mascararEmail } from '../utils/emailSenderUtil.js';

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
            .findOne({ 'cpf': '49745885088' }, {_id: false, cpf: true, nome: true, pontos: 150, email: true});
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ value: 'Usuário não encontrado', message: 'Nenhum usuário encontrado com o CPF informado'});
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

        if (!user && !validatePassword) {
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
        let usuarioResponse = {
            id: user._id,
            nome: user.nome,
            email: user.email,
        };
        if(user.cpf != null) {
            usuarioResponse.cpf = user.cpf;
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
    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    let user = await User.findOne({cpf: parseInt(req.body.cpfOuCnpj.replace(/[^\d]/g, ''))});
    if(!user) {
        return res.status(404).json({error: true, message: 'Usuário não encontrado!'});
    }

    let token = '';
    token = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    try {
        sendEmail({
            to: user.email,
            subject: 'Depósito realizado com sucesso!',
            text: `Olá, ${user.nome}! Recebemos uma solicitação para redefinir a senha da sua conta Eco Voucher. Use o código de verificação ${token} para continuar com a recuperação. Este código expira em 15 minutos. Se você não solicitou esta recuperação de senha, ignore este e-mail. Sua conta permanecerá segura. Nunca compartilhe este código com outras pessoas. Use-o apenas no aplicativo do Eco Voucher. Crie uma senha forte com letras, números e símbolos e mantenha suas informações de login seguras. Em caso de dúvidas, entre em contato com nosso suporte através do aplicativo. Equipe Eco Voucher.`,
            html: `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Recuperação de Senha - Eco Voucher</title>
                </head>
                <body style="margin:0; padding:20px; background-color:#F5F5F5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height:1.6;">
                    <div style="max-width:600px; margin:0 auto; background-color:#FFFFFF; border-radius:12px; overflow:hidden; border:1px solid #CDE5CE;">
                    <div style="background-color:#FFFFFF; padding:40px 30px; text-align:center; border-bottom:1px solid #CDE5CE;">
                        <div style="margin-bottom:20px;">
                        <div style="width:80px; height:80px; background-color:#F5F5F5; border-radius:50%; border:1px solid #CDE5CE; overflow:hidden; display:flex; align-items:center; justify-content:center; margin:0 auto;">
                            <img src="https://via.placeholder.com/80x80/076921/FFFFFF?text=ECO" alt="Eco Voucher Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
                        </div>
                        </div>
                        <h1 style="color:#076921; font-size:24px; font-weight:600; margin-top:10px;">Recuperação de Senha</h1>
                    </div>

                    <div style="padding:40px 30px; text-align:center;">
                        <div style="font-size:18px; color:#1c1c1c; margin-bottom:25px; font-weight:500;">Olá, ${user.nome}!</div>
                        <div style="font-size:16px; color:#757575; margin-bottom:35px;">Recebemos uma solicitação para redefinir a senha da sua conta Eco Voucher. Use o código de verificação abaixo para continuar com a recuperação da sua senha.</div>

                        <div style="background-color:#076921; border-radius:12px; padding:30px 20px; margin:30px 0; text-align:center;">
                        <div style="font-size:14px; color:#FFFFFF; font-weight:500; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;">Seu código de verificação</div>
                        <div style="display:inline-block;">
                            <table cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr>
                                ${token.split('').map(digit => `
                                <td style="padding:0 5px;">
                                    <div style="width:40px; height:50px; background-color:#FFFFFF; border:2px solid #CDE5CE; border-radius:8px; text-align:center; font-size:24px; font-weight:900; color:#076921; line-height:50px;">${digit}</div>
                                </td>
                                `).join('')}
                            </tr>
                            </table>
                        </div>
                        </div>

                        <div style="background-color:#F5F5F5; border-radius:8px; padding:20px; margin:25px 0; border:1px solid #CDE5CE; font-size:14px; color:#757575; font-weight:500;">
                        ⏰ Este código expira em 15 minutos
                        </div>

                        <div style="background-color:#fff3cd; border-left:4px solid #ffc107; padding:20px; margin:30px 0; border-radius:0 8px 8px 0; text-align:left;">
                        <div style="font-size:14px; font-weight:600; color:#e65100; margin-bottom:8px;">⚠️ Importante</div>
                        <div style="font-size:14px; color:#757575;">Se você não solicitou esta recuperação de senha, ignore este email. Sua conta permanecerá segura.</div>
                        </div>

                        <div style="background-color:#f8f9fa; border-radius:8px; padding:20px; margin:25px 0; text-align:left;">
                        <div style="color:#076921; font-size:16px; margin-bottom:12px;">🔒 Dicas de Segurança</div>
                        <ul style="list-style:none; padding-left:0; font-size:14px; color:#757575;">
                            <li style="margin-bottom:8px;">✓ Nunca compartilhe este código com outras pessoas</li>
                            <li style="margin-bottom:8px;">✓ Use o código apenas no aplicativo do Eco Voucher</li>
                            <li style="margin-bottom:8px;">✓ Crie uma senha forte com letras, números e símbolos</li>
                            <li style="margin-bottom:8px;">✓ Mantenha suas informações de login seguras</li>
                        </ul>
                        </div>

                        <div style="font-size:16px; color:#757575;">Precisa de ajuda? Entre em contato com nosso suporte através do aplicativo.</div>
                    </div>

                    <div style="background-color:#F5F5F5; color:#757575; padding:30px; text-align:center; border-top:1px solid #CDE5CE;">
                        <div style="font-size:14px; color:#757575; margin-bottom:15px;">Este é um email automático, não responda a esta mensagem.</div>
                        <div style="font-size:16px; color:#1c1c1c; font-weight:600;"><span style="color:#076921;">ECO</span> VOUCHER</div>
                    </div>
                    </div>
                </body>
                </html>
            `
        });
        const newToken = new Token({
            idUser: user._id,
            token: token,

        });
        await newToken.save();

        return res.status(200).json({error: false, message: `Digite código de 6 dígitos enviado por Email para ${mascararEmail(user.email)}`});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: true, message: 'Erro ao enviar o código de redefinição.'});
    }



}

export async function resetPassword(req, res) {
    const {token, novaSenha } = req.body;

    if ( !token || !novaSenha) {
        return res.status(400).json({ error: true, message: 'CPF/CNPJ, token e nova senha são obrigatórios.' });
    }

    try {
        console.log(token)
        const tokenDoc = await Token.findOne({ token: token });
        console.log(tokenDoc)
        if (!tokenDoc) {
            return res.status(400).json({ error: true, message: 'Token inválido.' });
        }

        // Verifica se o token expirou (15 minutos)
        const tokenCreatedAt = tokenDoc.created_at || tokenDoc._id.getTimestamp();
        const now = new Date();
        const diffMinutes = (now - tokenCreatedAt) / (1000 * 60);
        if (diffMinutes > 15) {
            await Token.deleteOne({ _id: tokenDoc._id });
            return res.status(400).json({ error: true, message: 'Token expirado.' });
        }

        // Atualiza a senha do usuário (hash)
        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        User.senha = hashedPassword;
        await User.updateOne();

        // Remove o token após o uso
        await Token.deleteOne({ _id: tokenDoc._id });

        return res.status(200).json({ error: false, message: 'Senha redefinida com sucesso.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: 'Erro ao redefinir a senha.' });
    }
}

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

export async function aprovarPj(req, res) {
    let { cnpj } = req.body;

    try {
        console.log(cnpj)
        let company = await Company.findOne({cnpj: {$eq: cnpj}});
        console.log(company)
        if (!company) {
            return res.status(404).json({error: true, message: 'Usuário não encontrado!'});
        }
        console.log(Company._id)
        company = await Company.updateOne({_id: company._id}, {$set: {aprovado: true}});
        if(!company) {
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
