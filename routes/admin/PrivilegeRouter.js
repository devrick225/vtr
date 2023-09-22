const express = require('express')

const {
    createPrivilege, getPrivileges, getPrivilege, updatePrivilege, deletePrivilege
} = require("../../controller/admin/PrivilegeController")
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");



const privilegeRouter = express.Router();

privilegeRouter.post('/',isAuthenticated,createPrivilege);
privilegeRouter.get('/', isAuthenticated, roleRestriction, getPrivileges)

privilegeRouter
    .route("/:id")
    .get(getPrivilege)
    .put(updatePrivilege)
    .delete(deletePrivilege)
;


module.exports = privilegeRouter
