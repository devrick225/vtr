const AsyncHandler = require('express-async-handler');
const sendEmailWithResend = require('./../services/mailService');

const User = require('../model/User');
const {hashPassword} = require("../utils/helpers");

exports.getUsers = AsyncHandler(async (req, res) => {
    const users = await User.find().populate('agence');
    res.status(200).json({
        status: "Success",
        message: "La liste des utilisateurs a été récupérée avec succès",
        data: users
    })

});


exports.getUser = AsyncHandler(async (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "L'utilisateur' a été récupérée avec succès",
        data: req.userAuth
    })

});


exports.updateSignature = AsyncHandler(async (req, res) => {
    const {signature} = req.body
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

exports.updatePassword = AsyncHandler(async (req, res) => {

    const {password} = req.body
    const user = await User.findOne({_id: req.params.id});

    if (!user) {
        throw new Error("L'utilisateur n'existe pas");
    }


    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        password: await hashPassword(password),
    }, {
        new: true,
    })

    const emailOptions = {
        from: process.env.FROM,
        to: user.email,
        subject: 'Réinitialisation du mot de passe',
        templateName: 'mailChangePassword',
        templateData: {nomUtilisateur: user.lastname, prenomUtilisateur: user.firstname}
    };
    sendEmailWithResend(emailOptions)
        .then(() => console.log('Email sent!'))
        .catch((error) => console.error('Error:', error));


    res.status(200).json({
        status: "Success",
        message: "Le mot de passe a été modifiée avec succès",
        data: updateUser
    })

});


exports.updateUser = AsyncHandler(async (req, res) => {
    const {
        username,
        firstname,
        lastname,
        email,
        contact,
        fonction,
        agence,
        userGroup
    } = req.body;


    const user = await User.findOne({_id: req.params.id});

    if (!user) {
        throw new Error("L'utilisateur n'existe pas");
    }


    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        contact: contact,
        fonction: fonction,
        agence: agence,
        userGroup: userGroup
    }, {
        new: true,
    })

    const emailOptions = {
        from: process.env.FROM,
        to: user.email,
        subject: 'Mise à jour des informations',
        templateName: 'mailUpdateUser',
        templateData: {nomUtilisateur: user.lastname, prenomUtilisateur: user.firstname}
    };
    sendEmailWithResend(emailOptions)
        .then(() => console.log('Email sent!'))
        .catch((error) => console.error('Error:', error));


    res.status(200).json({
        status: "Success",
        message: "L'utilsiateur a été modifiée avec succès",
        data: updateUser
    })

})


exports.toggleUserStatus = AsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("L'utilisateur n'existe pas");
    }

    // Inverse l'état actuel du champ `active`
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { active: !user.active },
        { new: true }
    );

    res.status(200).json({
        status: "Success",
        message: `Le statut de l'utilisateur a été mis à jour avec succès. Le compte est maintenant ${updatedUser.active ? 'activé' : 'désactivé'}.`,
        data: updatedUser
    });
});





