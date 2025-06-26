import validator from 'validator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const validateContato = (req, res, next) => {
    const { name, email, telefone, tipo, mensagem } = req.body;

    if(!name || validator.isEmpty(String(name))) {
        return res.status(400).send({ message: "Nome é obrigatório" });
    }

    if(!email || !validator.isEmail(String(email))) {
        return res.status(400).send({ message: "Email inválido" });
    }

    if(!telefone || validator.isEmpty(String(telefone))) {
        return res.status(400).send({ message: "Telefone é obrigatório" });
    }

    if((!tipo || validator.isEmpty(String(tipo))) && req.method != 'PATCH') {
        return res.status(400).send({ message: "Tipo é obrigatório" });
    }

    if(!mensagem || validator.isEmpty(String(mensagem))) {
        return res.status(400).send({ message: "Mensagem é obrigatória" });
    }

    next();
};


export const updateData = function(next) {
    this.set({ dataEnvio: new Date() });
    next();
};
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: err.message });
};

export const formatDateMiddleware = (req,res, next) => {
    res.formatDate = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
    next();
};
