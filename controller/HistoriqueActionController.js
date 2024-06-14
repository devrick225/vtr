const AsyncHandler = require('express-async-handler');
const HistoriqueAction = require('../model/HistoriqueAction');
const axios = require("axios");


exports.getHistoriqueActions = AsyncHandler(async (req, res) => {





    const historiques = await HistoriqueAction.find().populate('user');
    res.status(200).json({
        status: "Success",
        message: "La liste des actions ont été récupérée avec succès",
        data: historiques
    })

});


exports.getHistoriqueActionsByUser = AsyncHandler(async (req, res) => {

    const historiques = await HistoriqueAction.find().sort({createdAt: -1}).where('user').equals(req.userAuth._id).populate('user');
    res.status(200).json({
        status: "Success",
        message: "La liste des actions ont été récupérée avec succès",
        data: historiques
    })

});



