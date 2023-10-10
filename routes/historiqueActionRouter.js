const express = require('express')

const {getHistoriqueActions, getHistoriqueActionsByUser
} = require("../controller/HistoriqueActionController")
const isAuthenticated = require("../middlewares/isAuthenticated");



const historiqueActionRouter = express.Router();

historiqueActionRouter.get('/', isAuthenticated, getHistoriqueActions);
historiqueActionRouter.get('/me', isAuthenticated, getHistoriqueActionsByUser);


module.exports = historiqueActionRouter
