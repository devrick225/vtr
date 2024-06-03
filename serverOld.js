require('dotenv').config()
const http = require('http');
const https = require('https');
const app  = require('./app/app');
require('./config/dbConnect');
const fs = require("fs");
const Message = require("./model/Message");
const Conference = require("./model/Conference");
const User = require("./model/User");
const PORT = process.env.PORT || 3005;

const key = fs.readFileSync('./app/private.key')
const cert = fs.readFileSync('./app/certificate.crt')
const cred = {
    key,
    cert
}
//middleware

//server
 const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000', // Assurez-vous que cela correspond à l'URL du client
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    // Écouter les nouveaux messages
    socket.on('send_message', async (data) => {
        const {user, content, conference} = data;

        console.log('data', data)
        // Créer et sauvegarder le message dans la base de données
        const message = new Message({text: content, user: user, conference});
        const conferenceRetrieve = await Conference.findById(conference);

        const userRetrieve = await User.findById(user)
        message.save().then(async (savedMessage) => {
            console.log(savedMessage)
            conferenceRetrieve.messages.push(savedMessage._id);
            await conferenceRetrieve.save()
            // Émettre le message à tous les participants de la conférence
            io.emit('new_message', {text: content, user: userRetrieve, conference, createdAt: new Date()});
        }).catch((error) => {
            console.log(error)
            socket.emit('error', error.message);
        });
    });

    // Rejoindre une conférence spécifique (salle)
    socket.on('join_conference', (conferenceId) => {
        socket.join(conferenceId);
        console.log(`Un utilisateur a rejoint la conférence: ${conferenceId}`);
    });

    // Quand l'utilisateur se déconnecte
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});
//const httpsServer = https.createServer(cred, app)
server.listen(PORT, console.log(`Server http is running on port ${PORT}`))
//httpsServer.listen(8443, console.log(`Server https is running on port ${PORT}`))
