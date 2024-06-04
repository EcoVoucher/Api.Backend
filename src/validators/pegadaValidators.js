const validaPrestador = [
    check('cnpj')
        .not().isEmpty().trim().withMessage('É obrigatório informar o cnpj')
        .isNumeric().withMessage('O CNPJ deve ter apenas números')
        .isLength({min:14, max:14}).withMessage('O CNPJ deve ter 14 números')
        .custom(async (cnpj, { req }) => {
        const contaPrestador = await db.collection(nomeCollection)
        .countDocuments({
            'cnpj': cnpj,
            '_id': { $ne: new ObjectId(req.body._id) } // Excluir o documento atual da comparação
        })
        if(contaPrestador > 0){
            throw new Error('O CNPJ informado já está cadastrado!')
        }
    }),
    check('razao_social')
        .not().isEmpty().trim().withMessage('A Razão Social é obrigatória')
        .isLength({min:5}).withMessage('A razão é muito curta. Mínimo de 5')
        .isLength({max:200}).withMessage('A razão é muito longa. Máximo de 200')
        .isAlphanumeric('pt-BR', {ignore: '/. '})
        .withMessage('A razão social não pode conter caracteres especiais'),
    check('cep')
        .isLength({min:8, max:8}).withMessage('O CEP informado é inválido')
        .isNumeric().withMessage('O CEP deve ter apenas números')
        .not().isEmpty().trim().withMessage('É obrigatório informar o CEP'),
    check('endereco.logradouro').notEmpty().withMessage('O Logradouro é obrig.'),
    check('endereco.bairro').notEmpty().withMessage('O bairro é obrigatório'),
    check('endereco.localidade').notEmpty().withMessage('A localidade é obrig'),
    check('endereco.uf').isLength({min: 2, max:2}).withMessage('UF é inválida'),
    check('cnae_fiscal').isNumeric().withMessage('O CNAE deve ser um número'),
    check('nome_fantasia').optional({nullable: true}),
    check('data_inicio_atividade').matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('O formato de data é inválido. Informe yyyy-mm-dd'),
    check('localizacao.type').equals('Point').withMessage('Tipo inválido'),
    check('localizacao.coordinates').isArray().withMessage('Coord. inválidas'),
    check('localizacao.coordinates.*').isFloat()
        .withMessage('Os valores das coordenadas devem ser números')
    ]
