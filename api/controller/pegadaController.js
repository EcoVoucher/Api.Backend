import express from 'express'




export async function getPegada(req, res) {
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
            results.push(doc)
        });

        res.status(200).json(results);
        } catch (err) {
        res.status(500).json({
            message: 'Erro ao obter a listagem dos prestadores',
            error: `${err.message}`
        });
    }
}

export async function getPegadaById(req, res) {
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

export async function getPegadaByRazao(req, res) {
    try {
        const filtro = req.params.filtro.toString()
        const docs = []
        await db.collection(nomeCollection)
            .find({
                $or: [
                    { 'razao_social': { $regex: filtro, $options: 'i' } },
                    { 'nome_fantasia': { $regex: filtro, $options: 'i' } }
                ]
            }).forEach((doc) => {
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
}

export async function deletePegada(req, res) {
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
}
