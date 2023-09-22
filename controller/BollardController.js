const AsyncHandler = require('express-async-handler');
const Bollard = require('../model/Bollard');


exports.getBollards= AsyncHandler(async (req, res) => {


       const bollards = await Bollard.find().populate('quai');
    res.status(200).json({
        status: "Success",
        message: "La liste des bollards a été récupérée avec succès",
        data: bollards
    })

});




