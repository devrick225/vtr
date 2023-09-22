const express = require('express')

const {
    createPositionNavire, getPositionNavires, getPositionNavire, updatePositionNavire, deletePositionNavire
} = require("../../controller/admin/PositionNavireController")



const PositionNavireRouter = express.Router();

PositionNavireRouter
    .route("/")
    .post(createPositionNavire)
    .get(getPositionNavires);

PositionNavireRouter
    .route("/:id")
    .get(getPositionNavire)
    .put(updatePositionNavire)
    .delete(deletePositionNavire)
;


module.exports = PositionNavireRouter
