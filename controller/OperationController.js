const AsyncHandler = require('express-async-handler');
const Operation = require('../model/Operation');


exports.getOperations = AsyncHandler(async (req, res) => {
    let operations = await Operation.find().populate('conditionnement').populate('typeOperation').populate('marchandise');

    res.status(200).json({
        status: "Success",
        message: "La liste des operations a été récupérée avec succès",
        data: operations
    })

});


