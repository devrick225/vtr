const express = require('express')

const {
    createTypeDocument, getTypeDocuments, getTypeDocument, updateTypeDocument, deleteTypeDocument
} = require("../../controller/admin/TypeDocumentController")



const TypeDocumentRouter = express.Router();

TypeDocumentRouter
    .route("/")
    .post(createTypeDocument)
    .get(getTypeDocuments);

TypeDocumentRouter
    .route("/:id")
    .get(getTypeDocument)
    .put(updateTypeDocument)
    .delete(deleteTypeDocument)
;


module.exports = TypeDocumentRouter
