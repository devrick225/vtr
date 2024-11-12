const express = require('express')

const {
    getUsers, updateSignature, getUser, updatePassword,
    updateUser, toggleUserStatus
} = require("../controller/UserController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const historiqueDesActions = require("../middlewares/historiqueDesActions");
const actions = require("../utils/actions");


const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUsers);
userRouter.get('/me', isAuthenticated, getUser);
userRouter.put('/:id/changePassword', isAuthenticated, historiqueDesActions(actions.modifierMotDePasse), updatePassword);
userRouter.put('/:id', isAuthenticated, historiqueDesActions(actions.modifierUtilisateur), updateUser);
userRouter.post('/signature', isAuthenticated, historiqueDesActions(actions.modifierSignature), updateSignature);
userRouter.put('/:id/toggle-status', isAuthenticated, toggleUserStatus);


module.exports = userRouter
