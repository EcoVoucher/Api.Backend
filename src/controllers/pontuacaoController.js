import { validationResult } from 'express-validator';
import { Deposito, historicoPontuacao } from '../models/pontuacaoModel.js';
import sendEmail from '../utils/emailSenderUtil.js';
import { User } from '../models/userModel.js';



/**
 * GET /api/Pontuacao/
 * Lista os usuarios
 * Parâmetros: limit, skip e order
 */
export class PontuacaoController {
    static async getPontuacao(req, res) {
        /*
            #swagger.tags = ['Pontuacao']
            #swagger.description = 'Endpoint para obter a pontuação dos usuários'
        */
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }
        const { limit, skip, order } = req.query;

        try {
            // const pontuacao = await Pontuacao
            //     .find()
            //     .limit(parseInt(limit) || 10)
            //     .skip(parseInt(skip) || 0)
            //     .sort({ order: 1 });


            res.status(200).json(pontuacao);
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao obter a pontuação dos usuários!',
                error: `${err.message}`
            });
        }
    }


    static async postPontuacao(req, res) {
        /*
            #swagger.tags = ['Pontuacao']
            #swagger.description = 'Endpoint para obter a pontuação dos usuários'
        */
        const { limit, skip, order } = req.query;
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {
            const cpf = req.body.cpf.replace(/[^\d]/g, '');
            const user = await User.findOne({ cpf: cpf }, {});
            if(!user) {
                return res.status(404).json({ error: true, message: 'Usuário não encontrado' });
            }
            const email = user.email;
            const newPontuacao = new Deposito({...req.body, idUser: user._id, descricao: req.body.descricao || 'Depósito de material'});
            newPontuacao.save().then((deposito) => {
                deposito = deposito.toObject();
                historicoPontuacao.findOne({ idUser: user._id }).then(historico => {
                    if (!historico) {
                        hsitoricoPontuacao.create({
                            idUser: user._id,
                            movimentacoes: [{
                                tipo: 'entrada',
                                pontos: Number(deposito.totalPontos),
                                descricao: deposito.descricao,
                            }]
                        });
                    } else {
                        historico.movimentacoes.push({
                            tipo: 'entrada',
                            pontos: Number(deposito.totalPontos),
                            descricao: deposito.descricao,
                        });
                        historico.save();
                    }
                });
                deposito.codigo = deposito._id;
                deposito.dataHora = new Date(deposito.createdAt).toLocaleString('pt-BR');
                delete deposito._id;
                delete deposito.__v;

                User.updateOne({ _id: user._id }, { $inc: { pontos: Number(deposito.totalPontos) }}).then(() => {
                    sendEmail({
                        to: email,
                        subject: 'Depósito realizado com sucesso!',
                        text: `ECOVOUCHER - PONTOS ADICIONADOS! ⭐\n\n---\n\nOlá, ${user.nome}!\n\nObrigado por adicionar pontos. Seus pontos foram creditados com sucesso e já estão disponíveis em sua conta.\n\nDETALHES DOS PONTOS\n\nPontos: ${deposito.valor} pontos\nData: ${deposito.data}\nCódigo da Transação: ${deposito.codigo}\n\n---\n\nIMPORTANTE: Guarde este código para futuras consultas. Em caso de dúvidas, entre em contato conosco informando o código da transação.\n\n---\n\nATENDIMENTO AO CLIENTE\n\nHorários:\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 12h\n\n---\n\nEste é um email automático, não responda esta mensagem. Em caso de dúvidas, utilize nossos canais oficiais de atendimento.\n\nEcoVoucher 🌿\nSustentabilidade em cada ponto`,
                        html: `
                            <!DOCTYPE html>
                            <html lang="pt-br">
                            <head>
                                <meta charset="UTF-8">
                                <title>Confirmação de Depósito</title>
                            </head>
                            <body style="margin:0; padding:0; background-color:#f4f4f4;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding:20px 0;">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:6px; overflow:hidden; font-family:Arial, sans-serif;">

                                        <!-- Header -->
                                        <tr>
                                        <td align="center" style="background-color:#076921; padding:40px 30px; color:#ffffff;">
                                            <div style="font-size:48px; line-height:1;">✓</div>
                                            <h1 style="margin:10px 0; font-size:24px;">Pontos Adicionados!</h1>
                                            <p style="margin:0; font-size:16px;">Seus pontos foram creditados com sucesso</p>
                                        </td>
                                        </tr>

                                        <!-- Conteúdo -->
                                        <tr>
                                        <td style="padding:30px;">
                                            <p style="font-size:16px; color:#333333; margin:0 0 20px;">
                                            Olá, ${user.nome}!<br><br>
                                            Obrigado por adicionar pontos. Seus pontos foram creditados com sucesso e já estão disponíveis em sua conta.
                                            </p>

                                            <!-- Detalhes -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8f9fa; border-left:5px solid #076921; padding:20px; margin:20px 0;">
                                            <tr>
                                                <td colspan="2" style="font-size:18px; color:#2c3e50; font-weight:bold; padding-bottom:10px;">
                                                ⭐ Detalhes dos Pontos
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:14px; color:#555; padding:8px 0;">Pontos</td>
                                                <td align="right" style="font-size:18px; font-weight:bold; color:#076921;">${deposito.totalPontos} pontos</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:14px; color:#555; padding:8px 0;">Data</td>
                                                <td align="right" style="font-size:16px; color:#333;">${deposito.dataHora}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:14px; color:#555; padding:8px 0;">Código da Transação</td>
                                                <td align="right" style="font-family:'Courier New', monospace; background-color:#CDE5CE; color:#4a4a4a; font-size:14px; padding:6px 10px; border-radius:4px;">
                                                ${deposito.codigo}
                                                </td>
                                            </tr>
                                            </table>

                                            <!-- Mensagem importante -->
                                            <div style="background-color:#e3f2fd; padding:20px; border-left:4px solid #2196F3; color:#1565c0; font-size:15px; margin-top:20px;">
                                            ℹ️ <strong>Importante:</strong> Guarde este código para futuras consultas. Em caso de dúvidas, entre em contato conosco informando o código da transação.
                                            </div>
                                        </td>
                                        </tr>

                                        <!-- Footer -->
                                        <tr>
                                        <td style="background-color:#f8f9fa; text-align:center; padding:20px;">
                                            <p style="margin:0; font-size:14px; color:#666;">
                                            <strong>Atendimento ao Cliente</strong><br>
                                            Segunda a Sexta: 8h às 18h<br>
                                            Sábado: 8h às 12h
                                            </p>
                                            <p style="margin:20px 0 0 0; font-size:12px; color:#999;">
                                            Este é um e-mail automático. Por favor, não responda.<br>
                                            Em caso de dúvidas, utilize nossos canais oficiais de atendimento.
                                            </p>
                                            <p style="margin-top:15px;">
                                            <a href="#" style="margin:0 5px; text-decoration:none; font-size:20px;">📧</a>
                                            <a href="#" style="margin:0 5px; text-decoration:none; font-size:20px;">📱</a>
                                            <a href="#" style="margin:0 5px; text-decoration:none; font-size:20px;">💬</a>
                                            </p>
                                        </td>
                                        </tr>

                                    </table>
                                    </td>
                                </tr>
                                </table>
                            </body>
                            </html>
                        `
                    });

                    return res.status(202).json({status: 'ok', message: 'Depósito registrado com sucesso.', deposito});
                }).catch(err => {
                    console.error('Erro ao atualizar pontos do usuário:', err);
                    return res.status(500).json({error: true, message: 'Erro ao atualizar pontos do usuário'});
                });
            }).catch(error => {
                console.error('Erro ao inserir deposito:', error);
                return res.status(500).json({error: true, message: 'Erro ao efetuar o cadastro'});
            });
        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao obter a pontuação dos deposito!',
                error: `${err.message}`
            });
        }
    }
}

export default PontuacaoController;
