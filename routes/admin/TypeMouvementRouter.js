const express = require('express')

const {
    createTypeMouvement, getTypeMouvements, getTypeMouvement, updateTypeMouvement, deleteTypeMouvement
} = require("../../controller/admin/TypeMouvementController")



const typeMouvementRouter = express.Router();

typeMouvementRouter
    .route("/")
    .post(createTypeMouvement)
    .get(getTypeMouvements);

typeMouvementRouter
    .route("/:id")
    .get(getTypeMouvement)
    .put(updateTypeMouvement)
    .delete(deleteTypeMouvement)
;


module.exports = typeMouvementRouter
