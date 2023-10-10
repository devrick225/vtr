const express = require('express')

const {getUsers, updateSign, getUser,changePassword
} = require("../controller/UserController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const historiqueDesActions = require("../middlewares/historiqueDesActions");
const actions = require("../utils/actions");



const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUsers);
userRouter.get('/me', isAuthenticated, getUser);
userRouter.get('/changePassword', isAuthenticated, historiqueDesActions(actions.modifierMotDePasse),changePassword);
userRouter.put('/sign', isAuthenticated, historiqueDesActions(actions.modifierSignature),updateSign);


module.exports = userRouter
