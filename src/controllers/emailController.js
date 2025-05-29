import { sendWelcomeEmail } from "../services/emailService.js"


export async function sendEmail(req, res) {
    console.log(req.body)
    sendWelcomeEmail(req.body.email)


    

}