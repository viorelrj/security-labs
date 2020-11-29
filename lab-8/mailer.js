const nodemailer = require("nodemailer");

class Mailer {
    #transporter

    constructor() {
    }

    async init() {
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        this.#transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    async send(receiver, link) {
        let info = await this.#transporter.sendMail({
            from: '"Automation" <noreply@business.com>', // sender address
            to: receiver, // list of receivers
            subject: "Email Confirmation ✔", // Subject line
            html: `You can confirm your email here: ${link}`,
        });

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}

module.exports = {
    Mailer
}