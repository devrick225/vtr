const axios = require('axios');
const AsyncHandler = require('express-async-handler');
const CHAT_ENGINE_PROJECT_ID = '6f08a0dc-20ad-4819-bb2c-ac40d9cf8854'; // Replace with your ChatEngine Project ID
const CHAT_ENGINE_PRIVATE_KEY = '0b340ab8-e50b-4428-b556-52e37dc4e2e5';
const User = require('../model/User');
const UserGroup = require('../model/UserGroup');
const Agence = require('../model/Agence');
const {hashPassword, isPasswordMatched} = require("../utils/helpers");
const generateToken = require("../utils/generateToken");
const HistoriqueAction = require("../model/HistoriqueAction");
const actions = require("../utils/actions");


exports.register = AsyncHandler(async (req, res) => {
    const {username, firstname, lastname, email, password, contact, fonction, userGroup, agence} = req.body;
    const existUsername = await User.findOne({username});
    if (existUsername) {
        throw new Error(`L'utilisateur avec le nom d'utilsateur ${username} existe déjà`);
    }
    const existEmail = await User.findOne({email});

    if (existEmail) {
        throw new Error(`L'utilisateur avec l'email ${username} existe déjà`);
    }
    const existUserGroup = await UserGroup.findById(userGroup);
    if (!existUserGroup) {
        throw new Error(`Le groupe d'utilisateur n'existe pas`);
    }

    const existAgence = await Agence.findById(agence);
    if (!existAgence) {
        throw new Error(`L'agence n'existe pas`);
    }

    const secret = "pac2024";
    try {
        await axios.post(
            'https://api.chatengine.io/users/',
            {username, first_name: firstname, last_name: lastname, secret},
            {
                headers: {
                    'Private-Key': CHAT_ENGINE_PRIVATE_KEY,
                },
            }
        );

        await axios.post(
            'https://api.chatengine.io/chats/256648/people/',
            {username},
            {
                headers: {
                    'Project-ID': CHAT_ENGINE_PROJECT_ID,
                    'User-Name': 'pac',
                    'User-Secret': 'pac2024',
                },
            }
        );
    } catch (error) {
        res.status(500);
        throw new Error('Error communicating with ChatEngine');
    }


    const user = await User.create({
        username,
        firstname,
        lastname,
        email,
        contact,
        fonction,
        agence,
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
    if (!user) {
        return res.status(404).json({
            status: "Error",
            message: "Mot de passe ou Email invalide"
        })
    }

    const isMatched = await isPasswordMatched(password, user.password);
    if (!isMatched) {
        return res.status(404).json({
            status: "Error",
            message: "Mot de passe ou Email invalide"
        })
    } else {
        await new HistoriqueAction({user: user._id, type: actions.authentification}).save();
        return res.status(200).json({
            status: "Success",
            message: "L'utilisateur a été connecté avec succès",
            data: generateToken(user._id)
        })
    }


});


exports.me = AsyncHandler(async (req, res) => {

    /* envoiMail(req.userAuth.email, 'Test', 'mailBienvenue', {
        nomUtilisateur: req.userAuth.lastname,
        prenomUtilisateur: req.userAuth.firstname,
        lienAccesApplicationVTR: 'test'
    }) */
    return res.status(200).json({
        status: "Success",
        message: "le profile de l'utilisateur a été récupéré avec succès",
        data: {user: req.userAuth, privileges: req.userAccess}
    })

});
