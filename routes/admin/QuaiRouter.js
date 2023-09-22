const express = require('express')

const {
    createQuai, getQuais, getQuai, updateQuai, deleteQuai
} = require("../../controller/admin/QuaiController")



const QuaiRouter = express.Router();

QuaiRouter
    .route("/")
    .post(createQuai)
    .get(getQuais);

QuaiRouter
    .route("/:id")
    .get(getQuai)
    .put(updateQuai)
    .delete(deleteQuai)
;


module.exports = QuaiRouter
