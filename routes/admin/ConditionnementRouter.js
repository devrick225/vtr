const express = require('express')

const {
    createConditionnement, getConditionnements, getConditionnement, updateConditionnement, deleteConditionnement
} = require("../../controller/admin/ConditionnementController")



const conditionnementRouter = express.Router();

conditionnementRouter
    .route("/")
    .post(createConditionnement)
    .get(getConditionnements);

conditionnementRouter
    .route("/:id")
    .get(getConditionnement)
    .put(updateConditionnement)
    .delete(deleteConditionnement)
;


module.exports = conditionnementRouter
