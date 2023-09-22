const express = require('express')

const {getPrestations, confirmPrestation, choosePrestataire
} = require("../controller/PrestationController")
const isAuthenticated = require("../middlewares/isAuthenticated");



const prestationRouter = express.Router();

prestationRouter.get('/', isAuthenticated, getPrestations);
prestationRouter.post('/:id/confirm', isAuthenticated, confirmPrestation);
prestationRouter.post('/:id/choosePrestataire', isAuthenticated, choosePrestataire);


module.exports = prestationRouter
