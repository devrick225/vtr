const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const Quai = require('../model/Quai');


exports.createEscale = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    console.log('user', userAuth)
    const outsideZone = await Zone.findOne().where('code').equals('OUTSIDE');
    console.log('outsideZone', outsideZone)
    const prevueEtat = await Etat.findOne().where('code').equals('PREVUE');
    console.log('prevueEtat', prevueEtat)
    const navireExist = await Navire.findById('6505daa897537c1a13e38310');
    console.log('navireExist', navireExist)
    const quaiExist = await Quai.findById('6505d55395b2b64f19460221');
    console.log('quaiExist', quaiExist)

    const {
        date_accostage_prevue,
        date_appareillage_prevue,
        date_arrivee_prevue,
        date_depart_prevue,
        date_entree_prevue,
        date_sortie_prevue,
        heure_accostage_prevue,
        heure_appareillage_prevue,
        heure_arrivee_prevue,
        heure_depart_prevue,
        heure_entree_prevue,
        heure_sortie_prevue
    } = req.body;


    const escaleCreate = await Escale.create({
        user: userAuth._id,
        zone: outsideZone._id,
        etat: prevueEtat._id,
        navire: navireExist._id,
        quai: quaiExist._id,
        date_accostage_prevue,
        date_appareillage_prevue,
        date_arrivee_prevue,
        date_depart_prevue,
        date_entree_prevue,
        date_sortie_prevue,
        heure_accostage_prevue,
        heure_appareillage_prevue,
        heure_arrivee_prevue,
        heure_depart_prevue,
        heure_entree_prevue,
        heure_sortie_prevue
    })

    res.status(201).json({
        status: "Success",
        message: "L'escale a été crée avec succès",
        data: escaleCreate
    })

});

exports.getEscales = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    let escales = [];
    if (userAuth.userGroup.code === "CONSIGNATAIRE") {
        escales = await Escale.find().where('user').equals(userAuth._id).populate('navire').populate('quai').populate('etat').populate('zone');
    } else {
        escales = await Escale.find().populate('navire').populate('etat').populate('zone').populate('quai');
    }
    res.status(200).json({
        status: "Success",
        message: "La liste des escales a été récupérée avec succès",
        data: escales
    })

});


