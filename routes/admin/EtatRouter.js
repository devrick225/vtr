const express = require('express')

const {
    createEtat, getEtats, getEtat, updateEtat, deleteEtat
} = require("../../controller/admin/EtatController")



const etatRouter = express.Router();

etatRouter
    .route("/")
    .post(createEtat)
    .get(getEtats);

etatRouter
    .route("/:id")
    .get(getEtat)
    .put(updateEtat)
    .delete(deleteEtat)
;


module.exports = etatRouter
