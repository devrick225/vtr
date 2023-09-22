const express = require('express')

const {
    createPrestataire, getPrestataires, getPrestataire, updatePrestataire, deletePrestataire
} = require("../../controller/admin/PrestataireController")



const prestataireRouter = express.Router();

prestataireRouter
    .route("/")
    .post(createPrestataire)
    .get(getPrestataires);

prestataireRouter
    .route("/:id")
    .get(getPrestataire)
    .put(updatePrestataire)
    .delete(deletePrestataire)
;


module.exports = prestataireRouter
