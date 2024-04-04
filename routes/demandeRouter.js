const express = require('express')

const {getDemandes, createDemande, validateDemande, invalidateDemande, cancelDemande, updateDemande, devalidateDemande,
    getDemandesByEscaleId
} = require("../controller/DemandeController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const historiqueDesActions = require("../middlewares/historiqueDesActions");
const actions = require("../utils/actions");



const demandeRouter = express.Router();

demandeRouter.get('/', isAuthenticated, getDemandes);
demandeRouter.post('/', isAuthenticated, historiqueDesActions(actions.creerDemande),createDemande);
demandeRouter.put('/:id', isAuthenticated, historiqueDesActions(actions.modifierDemande),updateDemande);
demandeRouter.put('/:id/validate', isAuthenticated, historiqueDesActions(actions.validerDemande), validateDemande);
demandeRouter.put('/:id/devalidate', isAuthenticated, historiqueDesActions(actions.devaliderDemande), devalidateDemande);
demandeRouter.put('/:id/invalidate', isAuthenticated, historiqueDesActions(actions.rejeterDemande),invalidateDemande);
demandeRouter.put('/:id/cancel', isAuthenticated, historiqueDesActions(actions.annulerDemande),cancelDemande);

module.exports = demandeRouter
