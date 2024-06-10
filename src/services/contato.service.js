import Contato from "../models/ContatoModel.js";

export const create = (body) => Contato.create(body);

export const findAllService = () => Contato.find();

export const findByIdService = (id) => Contato.findById(id);

export const updateService = async (id, data) => {
    try {
        const updatedContato = await Contato.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true } // 'new: true' retorna o documento atualizado, 'runValidators' aplica as validações do schema
        );
        return updatedContato;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const remove = (id) => Contato.findByIdAndDelete(id);

export const getComplexQuery = async (tipos, dateStart, dateEnd) => {
return await Contato.find({
    tipo: { $in: tipos },
    dataEnvio: { $gte: new Date(dateStart), $lte: new Date(dateEnd) }
})
    .sort({
    tipo: 1,          // Primeiro ordena pelo tipo
    dataEnvio: 1      // Depois ordena pela data dentro de cada tipo
    });
};


const contatoService = { create, findAllService, findByIdService, updateService,remove, getComplexQuery }

export default contatoService;
