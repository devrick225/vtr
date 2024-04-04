const express = require('express')

const {getOperations
} = require("../controller/OperationController")
const isAuthenticated = require("../middlewares/isAuthenticated");


const operationRouter = express.Router();

operationRouter.get('/', isAuthenticated, getOperations);

module.exports = operationRouter
