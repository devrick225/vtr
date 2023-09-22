const express = require('express')

const {
    createAccess
} = require("../../controller/admin/AccessController")



const accessRouter = express.Router();

accessRouter
    .route("/")
    .post(createAccess);



module.exports = accessRouter
