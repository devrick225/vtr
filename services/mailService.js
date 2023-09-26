require('dotenv').config()
const nodemailer = require('nodemailer');
let ejs = require('ejs');
const Promise = require('bluebird');
const path = require('path');
const e = require("express");
exports.envoiMail = (to, subject, template, variables) => {
    const params = {
        host: process.env.SMTP_SERVER_HOST,
        port: process.env.SMTP_SERVER_PORT
    };
    if (process.env.SMTP_SERVER_LOGIN && process.env.SMTP_SERVER_LOGIN.length>0) {
        params.auth = {
            user: process.env.SMTP_SERVER_LOGIN,
            pass: process.env.SMTP_SERVER_PASSWORD
        };
    }
    let transport = nodemailer.createTransport(params);

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
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('ok')
                    }
                });
            });

};
