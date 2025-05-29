import sendEmail from '../utils/emailSenderUtil.js';

export const sendWelcomeEmail = async (userEmail) => {
  return sendEmail({
    to: 'joao_pedro01@terra.com.br',
    subject: 'Bem-vindo!',
    text: 'Obrigado por se cadastrar.',
    html: '<h1>Bem-vindo!</h1><p>Obrigado por se cadastrar.</p>'
  });
};
