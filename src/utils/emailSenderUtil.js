import transporter from '../config/emailConfig.js';

export function mascararEmail(email) {
    // Verifica se o e-mail é válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        throw new Error("E-mail inválido");
    }

    // Separa o nome de usuário e o domínio
    const [usuario, dominio] = email.split('@');

    // Mantém a primeira letra do usuário e substitui o restante por '*'
    const mascaradoUsuario = usuario[0] + '*'.repeat(usuario.length - 1);

    // Retorna o e-mail mascarado
    return `${mascaradoUsuario}@${dominio}`;
}



const sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: `"EcoVoucher" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
    }
};

export default sendEmail;
