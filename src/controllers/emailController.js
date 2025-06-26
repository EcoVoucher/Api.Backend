import { sendWelcomeEmail } from "../services/emailService.js"


export async function sendEmail(req, res) {
    sendWelcomeEmail(req.body.email)




}
