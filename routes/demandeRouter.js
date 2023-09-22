const express = require('express')

const {getDemandes, createDemande, validateDemande, invalidateDemande, cancelDemande, updateDemande
} = require("../controller/DemandeController")
const isAuthenticated = require("../middlewares/isAuthenticated");



const demandeRouter = express.Router();

demandeRouter.get('/', isAuthenticated, getDemandes);
demandeRouter.post('/', isAuthenticated, createDemande);
demandeRouter.put('/:id', isAuthenticated, updateDemande);
demandeRouter.put('/:id/validate', isAuthenticated, validateDemande);
demandeRouter.put('/:id/invalidate', isAuthenticated, invalidateDemande);
demandeRouter.put('/:id/cancel', isAuthenticated, cancelDemande);

module.exports = demandeRouter
