const express = require('express')

const {
    createNavire, getNavires, getNavire, updateNavire, deleteNavire, getNaviresByImoOrMmsi
} = require("../../controller/admin/NavireController")



const NavireRouter = express.Router();

NavireRouter
    .route("/")
    .post(createNavire)
    .get(getNavires);

NavireRouter.get('/search', getNaviresByImoOrMmsi)
NavireRouter
    .route("/:id")
    .get(getNavire)
    .put(updateNavire)
    .delete(deleteNavire)
;


module.exports = NavireRouter
