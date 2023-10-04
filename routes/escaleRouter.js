const express = require('express')

const {createEscale, getEscales, getEscaleOperations, getEscalePrestations, getEscale, getEscaleMouvements,
    updateDossierEscale, getDossierEscale
} = require("../controller/EscaleController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const historiqueDesActions = require("../middlewares/historiqueDesActions");
const actions = require("../utils/actions");

const escaleRouter = express.Router();

escaleRouter.post('/', isAuthenticated, historiqueDesActions(actions.creerEscale),createEscale);
escaleRouter.get('/', isAuthenticated,getEscales);
escaleRouter.get('/:id/operations', isAuthenticated, getEscaleOperations);
escaleRouter.get('/:id', isAuthenticated, getEscale);
escaleRouter.get('/:id/prestations', isAuthenticated, getEscalePrestations);
escaleRouter.get('/:id/mouvements', isAuthenticated, getEscaleMouvements);
escaleRouter.put('/:id/dossierEscale', isAuthenticated, updateDossierEscale);
escaleRouter.get('/:id/dossierEscale', isAuthenticated, getDossierEscale);

module.exports = escaleRouter
