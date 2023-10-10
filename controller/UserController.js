const AsyncHandler = require('express-async-handler');
const User = require('../model/User');
const {hashPassword, isPasswordMatched} = require("../utils/helpers");


exports.getUsers= AsyncHandler(async (req, res) => {


       const users = await User.find();
    res.status(200).json({
        status: "Success",
        message: "La liste des utilisateurs a été récupérée avec succès",
        data: users
    })

});


exports.getUser= AsyncHandler(async (req, res) => {

    res.status(200).json({
        status: "Success",
        message: "L'utilisateur' a été récupérée avec succès",
        data: req.userAuth
    })

});

exports.updateSign= AsyncHandler(async (req, res) => {
    const {signature}= req.body
    const binaryData = Buffer.from(signature, 'base64');
    const updateUser = await User.findByIdAndUpdate(req.userAuth._id, {
        signature: binaryData,
    }, {
        new: true,
    })


    res.status(200).json({
        status: "Success",
        message: "La signature a été modifiée avec succès",
        data: updateUser
    })

});


exports.changePassword = AsyncHandler(async (req, res) => {



});





