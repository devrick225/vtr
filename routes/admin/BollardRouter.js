const express = require('express')

const {getBollards
} = require("../../controller/BollardController")
const isAuthenticated = require("../../middlewares/isAuthenticated");



const bollardRouter = express.Router();

bollardRouter.get('/', isAuthenticated, getBollards);


module.exports = bollardRouter
