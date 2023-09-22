const express = require('express')

const {getUsers
} = require("../controller/UserController")
const isAuthenticated = require("../middlewares/isAuthenticated");



const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUsers);


module.exports = userRouter
