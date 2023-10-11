require('dotenv').config()
const https = require('http');
const app  = require('./app/app');
require('./config/dbConnect');
const fs = require("fs");
const PORT = process.env.PORT || 3005;

const key = fs.readFileSync('./app/private.key')
const cert = fs.readFileSync('./app/certificate.crt')

const cred = {
    key,
    cert
}
//middleware


//server
const server = https.createServer(cred,app);
server.listen(PORT, console.log(`Server is running on port ${PORT}`))
