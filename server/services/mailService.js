const mailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = mailer.createTransport({
            host: process.env['SMTP_HOST'],
            port: process.env['SMTP_PORT'],
            secure: false,
            debug: true,
            auth: {
                user: process.env['SMTP_USER'],
                password: process.env['SMTP_PASSWORD'],
            }
        })
    }

    async sendActivationLinnk (to, link) {
        await this.transporter.sendMail({
            from: process.env['SMTP_USER'],
            to,
            subject: 'Activation accaunt',
            text: '',
            html:
            `
                <div>
                    <h1 style="font-family: sans-serif;">Для активайии аккаунта перейдите по ссылке</h1>
                    <a style="font-family: sans-serif;" href="${link}">Activate</a>
                </div>
            `
        })
    }
};

module.exports = new MailService();