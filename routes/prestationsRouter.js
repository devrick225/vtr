const express = require('express')

const {getPrestations, confirmPrestation, choosePrestataire, runPrestation, closePrestation
} = require("../controller/PrestationController")
const isAuthenticated = require("../middlewares/isAuthenticated");



const prestationRouter = express.Router();

prestationRouter.get('/', isAuthenticated, getPrestations);
prestationRouter.post('/:id/confirm', isAuthenticated, confirmPrestation);
prestationRouter.post('/:id/choosePrestataire', isAuthenticated, choosePrestataire);
prestationRouter.post('/:id/start', isAuthenticated, runPrestation);
prestationRouter.post('/:id/end', isAuthenticated, closePrestation);


module.exports = prestationRouter
