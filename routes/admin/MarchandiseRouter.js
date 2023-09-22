const express = require('express')

const {
    createMarchandise, getMarchandises, getMarchandise, updateMarchandise, deleteMarchandise
} = require("../../controller/admin/MarchandiseController")



const marchandiseRouter = express.Router();

marchandiseRouter
    .route("/")
    .post(createMarchandise)
    .get(getMarchandises);

marchandiseRouter
    .route("/:id")
    .get(getMarchandise)
    .put(updateMarchandise)
    .delete(deleteMarchandise)
;


module.exports = marchandiseRouter
