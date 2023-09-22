const express = require('express')

const {createEscale, getEscales, getEscaleOperations, getEscalePrestations, getEscale, getEscaleMouvements
} = require("../controller/EscaleController")
const isAuthenticated = require("../middlewares/isAuthenticated");

const escaleRouter = express.Router();

escaleRouter.post('/', isAuthenticated, createEscale);
escaleRouter.get('/', isAuthenticated, getEscales);
escaleRouter.get('/:id/operations', isAuthenticated, getEscaleOperations);
escaleRouter.get('/:id', isAuthenticated, getEscale);
escaleRouter.get('/:id/prestations', isAuthenticated, getEscalePrestations);
escaleRouter.get('/:id/mouvements', isAuthenticated, getEscaleMouvements);

module.exports = escaleRouter
