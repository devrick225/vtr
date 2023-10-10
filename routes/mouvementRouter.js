const express = require('express')

const {getMouvements, updateMouvement
} = require("../controller/MouvementController")
const isAuthenticated = require("../middlewares/isAuthenticated");


const mouvementRouter = express.Router();

mouvementRouter.get('/', isAuthenticated, getMouvements);
mouvementRouter.put('/:id', isAuthenticated, updateMouvement);

module.exports = mouvementRouter
