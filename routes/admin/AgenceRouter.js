const express = require('express')

const {
    createAgence, getAgences, getAgence, updateAgence, deleteAgence
} = require("../../controller/admin/AgenceController")



const agenceRouter = express.Router();

agenceRouter
    .route("/")
    .post(createAgence)
    .get(getAgences);

agenceRouter
    .route("/:id")
    .get(getAgence)
    .put(updateAgence)
    .delete(deleteAgence)
;


module.exports = agenceRouter
