const fs = require('fs');
const path = require('path');
let ejs = require('ejs');

const  {Resend}=  require("resend");

async function sendEmailWithResend(options) {

    const {to, from, subject, templateName, templateData} = options; // Destructure options
    // Validate required parameters
    if (!to || !from || !subject || !templateName || !templateData) {
        throw new Error('Missing required email parameters.');
    }

    const resendApiKey = process.env.RESEND_API_KEY; // Replace with your API key
    if (!resendApiKey) {
        throw new Error('RESEND_API_KEY environment variable not set.');
    }

    const resend = new Resend(resendApiKey);

    const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`); // Replace with your template path
    const templateContent = await fs.promises.readFile(templatePath, 'utf8'); // Use fs.promises for async/await

    try {
        const htmlContent = await ejs.render(templateContent, templateData); // Render EJS template
        const data = {
            from,
            to,
            subject,
            html: htmlContent,
        };



        const response = await resend.emails.send({to, from, subject, html: htmlContent})
        console.log(response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw for potential handling in calling code
    }
}

module.exports = sendEmailWithResend;
