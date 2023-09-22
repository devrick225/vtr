const AsyncHandler = require('express-async-handler');

const User = require('../model/User');
const UserGroup = require('../model/UserGroup');
const {hashPassword, isPasswordMatched} = require("../utils/helpers");
const generateToken = require("../utils/generateToken");

exports.register = AsyncHandler(async (req, res) => {
    const {username, firstname, lastname, email, password, contact, fonction,userGroup} = req.body;
    const existUsername = await User.findOne({username});
    if (existUsername) {
        throw new Error(`L'utilisateur avec le nom d'utilsateur ${username} existe déjà`);
    }
    const existEmail = await User.findOne({email});

    if (existEmail) {
        throw new Error(`L'utilisateur avec l'email ${username} existe déjà`);
    }
    const existUserGroup =  await UserGroup.findById(userGroup);
    if(!existUserGroup) {
        throw new Error(`Le groupe d'utilisateur n'existe pas`);
    }


    const user = await User.create({
        username,
        firstname,
        lastname,
        email,
        contact,
        fonction,
        password: await hashPassword(password),
        userGroup,
    });

    res.status(201).json({
        status: "Success",
        message: "L'utilisateur a été crée avec succès",
        data: user
    })
});


exports.login = AsyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        return res.status(404).json({
            status: "Error",
            message: "Mot de passe ou Email invalide"
        })
    }

    const isMatched = await isPasswordMatched(password, user.password);
    if(!isMatched) {
        return res.status(404).json({
            status: "Error",
            message: "Mot de passe ou Email invalide"
        })
    }else {
        return res.status(200).json({
            status: "Success",
            message: "L'utilisateur a été connecté avec succès",
            data: generateToken(user._id)
        })
    }



});


exports.me = AsyncHandler(async (req, res) => {
    return res.status(200).json({
        status: "Success",
        message: "le profile de l'utilisateur a été récupéré avec succès",
        data: {user: req.userAuth, privileges: req.userAccess}
    })

});
