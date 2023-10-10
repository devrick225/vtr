const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const Quai = require('../model/Quai');
const Mouvement = require('../model/Mouvement');



exports.getMouvements = AsyncHandler(async (req, res) => {
        const mouvements  = await Mouvement.find().populate('quai').populate('zone').populate('etat').populate({
        path: 'escale',
        populate: [
            {path: 'agence', model: 'Agence'},
            {path: 'navire', model: 'Navire'},
        ],
    });
    res.status(200).json({
        status: "Success",
        message: "La liste des mouvements a été récupérée avec succès",
        data: mouvements
    })

});


exports.updateMouvement = AsyncHandler(async (req, res) => {
    const mouvement = await Mouvement.findById(req.params.id)
    const partiEtat = await Etat.findOne().where('code').equals('PARTI');
    const quaiEtat = await Etat.findOne().where('code').equals('QUAI');
    const berthZone = await Zone.findOne().where('code').equals('BERTH');
    const outsideZone = await Zone.findOne().where('code').equals('OUTSIDE');


    if(req.body.effectivite === 'Entrée') {
        await Mouvement.findByIdAndUpdate(req.params.id, {
            date_accostage_effective: req.body.date,
            heure_accostage_effective: req.body.heure,
            etat: quaiEtat._id,
            zone: berthZone._id
        }, {new: true})
        await Escale.findByIdAndUpdate(mouvement.escale, {
            etat: quaiEtat._id,
            zone: berthZone._id
        })
    }else {
        await Mouvement.findByIdAndUpdate(req.params.id, {
            date_appareillage_effective: req.body.date,
            heure_appareillage_effective: req.body.heure,
            zone: outsideZone._id,
            etat: partiEtat._id,
        }, {new: true})
        await Escale.findByIdAndUpdate(mouvement.escale, {
            etat: partiEtat._id,
            zone: outsideZone._id
        })
    }
    res.status(200).json({
        status: "Success",
        message: "Mouvement updated",
    })

});



