require('dotenv').config()
const nodemailer = require('nodemailer');
let ejs = require('ejs');
const Promise = require('bluebird');
const path = require('path');
const e = require("express");
exports.envoiMail = (to, subject, template, variables) => {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "24fc815496b52a",
            pass: "7dc383fb1db45a"
        }
    });   // let transport = nodemailer.createTransport(params);

            variables.logoSociete = '';
            variables.couleurSociete = '#3D92F5';

            ejs.renderFile(path.join(__dirname, `../templates/${template}.ejs`), variables, {}, function (err, str) {
                if (err) {
                    reject(err);
                    return;
                }
                let message = {
                    from: process.env.SMTP_MAIL_FROM,
                    to: to,
                    subject: subject,
                    html: str
                };
                transport.sendMail(message, function (err) {
                    console.log(err)
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('ok')
                    }
                });
            });

};
