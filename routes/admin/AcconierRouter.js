const express = require('express')

const {
    createAcconier, getAcconiers, getAcconier, updateAcconier, deleteAcconier
} = require("../../controller/admin/AcconierController")



const acconierRouter = express.Router();

acconierRouter
    .route("/")
    .post(createAcconier)
    .get(getAcconiers);

acconierRouter
    .route("/:id")
    .get(getAcconier)
    .put(updateAcconier)
    .delete(deleteAcconier)
;


module.exports = acconierRouter
