import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { config } from 'src/config';

export interface IMailData {
    email: string;
    name: string;
    filters: {
        name: string;
        tasks: {
            name: string;
            url: string;
        }[]
    }[]
}

const newTransport: SMTPTransport.Options = {
    host: config.MAILER_HOST,
    port: config.MAILER_PORT,
    secure: config.MAILER_SECURE,
    auth: {
        user: config.MAILER_USER,
        pass: config.MAILER_PASSWORD,
    },
};

const defaultsMailOpts: SMTPTransport.Options = {
    from: config.MAILER_FROM,
};

// create reusable transporter object using the default SMTP transport
const mailerLib = nodemailer.createTransport(newTransport, defaultsMailOpts);

class Mailer {
    private mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor(mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>) {
        this.mailer = mailer;
    }

    public sendNewTasks(mailData: IMailData) {
        let text = `Hi, ${mailData.email}\n\n`;

        for (const filter of mailData.filters) {
            text += `Filter name: ${filter.name}\n`;

            for (const task of filter.tasks) {
                text += `<a href="${task.url}" > ${task.name} </a>\n`
            }

            text += '\n';
        }

        this.mailer.sendMail({
            to: mailData.email,
            subject: 'New jobs for you!',
            text: text
        }).catch(e => {
            console.error(`sendNewTasks error: ${e.message}`, mailData);
        })
    }
}

export const mailer = new Mailer(mailerLib);