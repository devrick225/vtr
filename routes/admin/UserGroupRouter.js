const express = require('express')

const {
    createUserGroup, getUserGroups, getUserGroup, updateUserGroup, deleteUserGroup
} = require("../../controller/admin/UserGroupController")



const userGroupRouter = express.Router();

userGroupRouter
    .route("/")
    .post(createUserGroup)
    .get(getUserGroups);

userGroupRouter
    .route("/:id")
    .get(getUserGroup)
    .put(updateUserGroup)
    .delete(deleteUserGroup)
;


module.exports = userGroupRouter
