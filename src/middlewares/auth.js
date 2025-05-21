import jwt from'jsonwebtoken';

export default async function auth(req, res, next){
    const token = req.header('access-token')
    if(!token) return res.status(401).json({ msg: 'Acesso negado. É obrigatório o envio do token JWT'}); //401-Not Authorized
    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY)
        /*
            o decoded irá conter:
            payload - id do usuário
            exp (expiration) - Data de expiração
            iat (issued at) - Data de criação
        */
        req.usuario = await decoded.user
        next() //direcionamos para o endpoint
    } catch(e) {
        res.status(403).send({error: `Token inválido: ${e.message}`})
    }
}
