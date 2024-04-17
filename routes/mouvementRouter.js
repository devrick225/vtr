const express = require('express')

const {getMouvements, updateMouvement, getMouvementsTest
} = require("../controller/MouvementController")
const isAuthenticated = require("../middlewares/isAuthenticated");


const mouvementRouter = express.Router();

mouvementRouter.get('/', isAuthenticated, getMouvements);
mouvementRouter.get('/test', isAuthenticated, getMouvementsTest);
mouvementRouter.put('/:id', isAuthenticated, updateMouvement);

module.exports = mouvementRouter
