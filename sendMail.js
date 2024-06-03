const nodemailer = require('nodemailer');

// Créer un transporteur en utilisant le service Gmail et les informations d'authentification
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ivoprestalertes@gmail.com',
        pass: 'xdqi oekr ohqn rlum'
    }
});

// Configuration de l'email à envoyer
let mailOptions = {
    from: 'ivoprestalertes@gmail.com', // adresse de l'expéditeur
    to: 'erickoffi29@gmail.com, kemersonsteveelavagnon@gmail.com, rboukari@pac.bj, jdohou@pac.bj', // adresse du destinataire
    subject: 'Hello from Node.js', // sujet de l'email
    text: 'Hello world!', // contenu de l'email en texte brut
    // html: '<b>Hello world!</b>' // contenu de l'email en HTML (optionnel)
};

// Envoi de l'email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Email sent: ' + info.response);
});
