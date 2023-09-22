const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const Quai = require('../model/Quai');
const Prestation = require('../model/Prestation');
const Conference = require("../model/Conference");
const UserGroup = require("../model/UserGroup");



exports.getPrestations = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const userGroup = await UserGroup.findById(userAuth.userGroup)
    if(userGroup.code === 'PRESTATAIRE') {
      const escales = await Prestation.find().where('user').equals(userAuth._id)
            .populate('serviceAssistance')
            .populate('etat')
            .populate('user')
            .populate({ path: 'mouvement',
                populate: [
                    { path: 'typeMouvement', model: 'TypeMouvement' },
                    { path: 'quai', model: 'Quai' },
                ],})
        res.status(200).json({
            status: "Success",
            message: "La liste des prestations a été récupérée avec succès",
            data: escales
        })

    }
        const escales = await Prestation.find()
            .populate('serviceAssistance')
            .populate('etat')
            .populate('user')
            .populate({ path: 'mouvement',
                populate: [
                    { path: 'typeMouvement', model: 'TypeMouvement' },
                    { path: 'quai', model: 'Quai' },
                ],})
    res.status(200).json({
        status: "Success",
        message: "La liste des prestations a été récupérée avec succès",
        data: escales
    })

});

exports.confirmPrestation = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;

    const userGroup = await UserGroup.findById(req.userAuth.userGroup)
    if(userGroup.code === 'CONSIGNATAIRE') {
       await Prestation.findByIdAndUpdate(req.params.id, {
            okConsignataire : true,
            consignataire: userAuth._id

       }, {
            new: true,
        })
    }
    if(userGroup.code === 'CAPITAINERIE') {
        await Prestation.findByIdAndUpdate(req.params.id, {
            okCapitainerie : true,
            capitaine: userAuth._id
        }, {
            new: true,
        })
    }

    res.status(200).json({
        status: "Success",
        message: `La prestation a été confirmé par : ${userGroup.libelle} - ${userAuth.lastname} ${userAuth.firstname}`,
    })





});



exports.choosePrestataire = AsyncHandler(async (req, res) => {
    const {user} = req.body;
        const updatePrestation = await Prestation.findByIdAndUpdate(req.params.id, {
            user
        }, {
            new: true,
        })

    res.status(200).json({
        status: "Success",
        message: `La ressource a bien été défini pour la prestation`,
        data: updatePrestation
    })



});


exports.runPrestation = AsyncHandler(async (req, res) => {
    const {user} = req.body;
    const updatePrestation = await Prestation.findByIdAndUpdate(req.params.id, {
        user
    }, {
        new: true,
    })

    res.status(200).json({
        status: "Success",
        message: `La ressource a bien été défini pour la prestation`,
        data: updatePrestation
    })



});

exports.closePrestation= AsyncHandler(async (req, res) => {
    const {user} = req.body;
    const updatePrestation = await Prestation.findByIdAndUpdate(req.params.id, {
        user
    }, {
        new: true,
    })

    res.status(200).json({
        status: "Success",
        message: `La ressource a bien été défini pour la prestation`,
        data: updatePrestation
    })



});



