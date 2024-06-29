import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    },
})

const sendEmail = (to, subject, htmlContent, attachments = []) => {
    const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to,
        subject,
        html: htmlContent,
        attachments
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) { return console.error(err) }
        console.log("Email sent:", info.response)
    })
}

export default sendEmail