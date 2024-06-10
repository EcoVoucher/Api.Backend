import { create, findAllService, findByIdService, updateService, remove, getComplexQuery} from '../services/contato.service.js';

export const contatoCreate = async (req, res) => {
    try {
        const contato = await create(req.body);

        if (!contato) {
            return res.status(400).send({ message: "Erro ao enviar a mensagem" });
        }

        return res.status(201).send({ message: "Mensagem enviada com sucesso",id_contato: contato._id });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};

export const findAll = async (req, res) => {
    try {
        const contatos = await findAllService();
        if (contatos.length === 0) {
            return res.status(400).send({ message: "Não há contatos cadastrados" });
        }
        const contatosFormatados = contatos.map(contato => ({
            ...contato._doc,
            dataEnvio: res.formatDate(contato.dataEnvio)
        }));
        res.send(contatosFormatados);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findContatoById = async (req, res) => {
    try {
        const contato = await findByIdService(req.params.id);
        if (!contato) {
            return res.status(404).send({ message: "Contato não encontrado" });
        }

        const contatoFormatado = {
            ...contato._doc,
            dataEnvio: res.formatDate(contato.dataEnvio)
        };
        return res.status(200).json(contatoFormatado);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Id de contato não encontrado!" });
    }
};

export const updateContato = async (req, res) => {
    try {
        const contato = await updateService(req.params.id, req.body);

        if (!contato) {
            return res.status(404).send({ message: "Contato não encontrado" });
        }

        const contatoFormatado = {
            ...contato._doc,
            dataEnvio: res.formatDate(contato.dataEnvio)
        };

        return res.status(200).send({ message: "Contato atualizado com sucesso", contato: contatoFormatado });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};


export const deleteContato = async (req, res) => {
    try {
        const contato = await remove(req.params.id);

        if (!contato) {
            return res.status(404).send({ message: "Contato não encontrado" });
        }

        return res.status(200).send({ message: "Contato deletado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};

export const getComplexContato = async (req, res) => {
    try {
        const { tipos, dateStart, dateEnd } = req.query;
        const tiposArray = tipos.split(',').map(Number); // Converte a string de tipos em um array de números
        const contatos = await getComplexQuery(tiposArray, dateStart, dateEnd);

        if (contatos.length === 0) {
            return res.status(404).send({ message: "Nenhum contato encontrado com os critérios fornecidos" });
        }

        const contatosFormatados = contatos.map(contato => ({
            ...contato._doc,
            dataEnvio: res.formatDate(contato.dataEnvio)
        }));
        return res.status(200).json(contatosFormatados);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};
