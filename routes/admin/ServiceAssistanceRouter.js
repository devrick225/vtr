const express = require('express')

const {
    createServiceAssistance, getServiceAssistances, getServiceAssistance, updateServiceAssistance, deleteServiceAssistance
} = require("../../controller/admin/ServiceAssistanceController")



const serviceAssistanceRouter = express.Router();

serviceAssistanceRouter
    .route("/")
    .post(createServiceAssistance)
    .get(getServiceAssistances);

serviceAssistanceRouter
    .route("/:id")
    .get(getServiceAssistance)
    .put(updateServiceAssistance)
    .delete(deleteServiceAssistance)
;


module.exports = serviceAssistanceRouter
