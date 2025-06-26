import { Pegada } from "../models/pegadaModel.js";
import { User } from "../models/userModel.js";

export async function createPegada(req, res) {
	try {
		const { documento, pontuacao } = req.body;
        const user = await User.findOne({cpf: documento});
        if(!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const pegada = await Pegada.findOne({userId: user._id});
        await User.updateOne({ _id: user._id }, { $set: { pontuacao: pontuacao }})
        if(!pegada) {
            const newPegada = await Pegada.create({
                userId: user._id,
                pontuacoes: [{
                    pontuacao,
                    data: new Date(),
                }]
            });
            newPegada.save();
            return res.status(202).json(newPegada);
        } else {
            pegada.pontuacoes.push({
                pontuacao,
                data: new Date(),
            });

            await pegada.save();
            return res.status(200).json(pegada);
        }
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

export async function getPegadaByCpf(req, res) {
	try {
        const cpf = req.params.documento;

        const user = await User.findOne({ cpf: cpf });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        console.log('CPF recebido:', user._id);

        const pegadas = await Pegada.find({ userId: user._id });
        console.log('Pegadas encontradas:', pegadas);
        if (!pegadas || pegadas.length === 0) {
            return res.status(404).json({ message: 'Pegada não encontrada para este CPF' });
        }
        // Se quiser retornar todas as pontuações ordenadas por id:
        const todasPontuacoes = pegadas.flatMap(p => p.pontuacoes);
        console.log(todasPontuacoes);
        console.log(pegadas)
        return res.status(200).json(todasPontuacoes);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

export async function getPegadaUltimaPontuacao(req, res) {
    try {
        const { documento } = req.params;
        const user = await User.findOne({cpf: documento});
        if(!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });

        }

        const pegada = await Pegada.findOne({ userId: user._id });
        if (!pegada || pegada.length === 0) {
            return res.status(404).json({ message: 'Pegada não encontrada para este CPF' });
        }
        const ultimaPontuacao = pegada.pontuacoes[pegada.pontuacoes.length - 1];
        return res.status(200).json(ultimaPontuacao);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
