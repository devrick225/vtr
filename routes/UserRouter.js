const express = require('express')

const {getUsers, updateSign, getUser
} = require("../controller/UserController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const historiqueDesActions = require("../middlewares/historiqueDesActions");
const actions = require("../utils/actions");



const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUsers);
userRouter.get('/me', isAuthenticated, getUser);
userRouter.put('/sign', isAuthenticated, historiqueDesActions(actions.modifierSignature),updateSign);


module.exports = userRouter
