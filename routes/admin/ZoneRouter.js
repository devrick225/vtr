const express = require('express')

const {
    createZone, getZones, getZone, updateZone, deleteZone
} = require("../../controller/admin/ZoneController")



const zoneRouter = express.Router();

zoneRouter
    .route("/")
    .post(createZone)
    .get(getZones);

zoneRouter
    .route("/:id")
    .get(getZone)
    .put(updateZone)
    .delete(deleteZone)
;


module.exports = zoneRouter
