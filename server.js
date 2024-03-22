require('dotenv').config()
const http = require('http');
const https = require('https');
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
//const server = http.createServer(app);
const httpsServer = https.createServer(cred, app)
//server.listen(PORT, console.log(`Server http is running on port ${PORT}`))
httpsServer.listen(8443, console.log(`Server https is running on port ${PORT}`))
