require('dotenv').config()
const https = require('https');
const app  = require('./app/app');
require('./config/dbConnect');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./cert/pac.bj_sansmot.key'),
    cert: fs.readFileSync('./cert/pac.bj.crt'),
};
const PORT = process.env.PORT || 3005;

//middleware


//server
const server = https.createServer(options,app);
server.listen(PORT, console.log(`Server is running on port ${PORT}`))
