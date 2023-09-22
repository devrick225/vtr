const express = require('express')

const {
    createTypeOperation, getTypeOperations, getTypeOperation, updateTypeOperation, deleteTypeOperation
} = require("../../controller/admin/TypeOperationController")



const typeOperation = express.Router();

typeOperation
    .route("/")
    .post(createTypeOperation)
    .get(getTypeOperations);

typeOperation
    .route("/:id")
    .get(getTypeOperation)
    .put(updateTypeOperation)
    .delete(deleteTypeOperation)
;


module.exports = typeOperation
