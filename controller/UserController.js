const AsyncHandler = require('express-async-handler');
const User = require('../model/User');


exports.getUsers= AsyncHandler(async (req, res) => {


       const users = await User.find();
    res.status(200).json({
        status: "Success",
        message: "La liste des utilisateurs a été récupérée avec succès",
        data: users
    })

});




