const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const DossierEscale = require('../model/DossierEscale');
const Mouvement = require('../model/Mouvement');


exports.getMouvements = AsyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const prevueEtat = await Etat.findOne().where('code').equals('PREVUE');
    const mouvementsAcc = await Mouvement.find({
        date_accostage_prevue: {
            $gte: today,
            $lt: tomorrow
        },
        etat: {
            $ne: prevueEtat._id
        }
    })
        .populate('quai').populate('zone').populate('etat').populate({
            path: 'escale',
            populate: [
                {path: 'agence', model: 'Agence'},
                {path: 'navire', model: 'Navire'},
            ],
        });


    const mouvementsApp = await Mouvement.find({

        date_appareillage_prevue: {
            $gte: today,
            $lt: tomorrow
        },

        etat: {
            $ne: prevueEtat._id
        }
    })
        .populate('quai').populate('zone').populate('etat').populate({
            path: 'escale',
            populate: [
                {path: 'agence', model: 'Agence'},
                {path: 'navire', model: 'Navire'},
            ],
        });
    const mouvements = [...mouvementsAcc, ...mouvementsApp];

    const filteredMouvements = mouvements.filter(mouvement => {
        const mouvementDate = new Date(mouvement.date_appareillage_effective);
        return !(mouvement.etat.code === "PARTI" && (mouvementDate >= today && mouvementDate < tomorrow));
    });

    res.status(200).json({
        status: "Success",
        message: "La liste des mouvements a été récupérée avec succès",
        data: filteredMouvements
    })

});


exports.updateMouvement = AsyncHandler(async (req, res) => {
    const mouvement = await Mouvement.findById(req.params.id)
    const partiEtat = await Etat.findOne().where('code').equals('PARTI');
    const quaiEtat = await Etat.findOne().where('code').equals('QUAI');
    const berthZone = await Zone.findOne().where('code').equals('BERTH');
    const outsideZone = await Zone.findOne().where('code').equals('OUTSIDE');

    const dossierEscale = await DossierEscale.findOne().where('escale').equals(mouvement.escale);

    if (req.body.effectivite === 'Entrée') {
        await Mouvement.findByIdAndUpdate(req.params.id, {
            date_accostage_effective: req.body.date,
            heure_accostage_effective: req.body.heure,
            etat: quaiEtat._id,
            zone: berthZone._id
        }, {new: true})

        await DossierEscale.findByIdAndUpdate(dossierEscale._id, {
            date_accostage: req.body.date,
            heure_accostage: req.body.heure,
            etat: quaiEtat._id,
        }, {new: true})

        await Escale.findByIdAndUpdate(mouvement.escale, {
            etat: quaiEtat._id,
            zone: berthZone._id
        }, {new: true})
    } else {
        await Mouvement.findByIdAndUpdate(req.params.id, {
            date_appareillage_effective: req.body.date,
            heure_appareillage_effective: req.body.heure,
            zone: outsideZone._id,
            etat: partiEtat._id,
        }, {new: true})

        await DossierEscale.findByIdAndUpdate(dossierEscale._id, {
            date_appareillage: req.body.date,
            heure_appareillage: req.body.heure,
            etat: partiEtat._id,
        }, {new: true})
        await Escale.findByIdAndUpdate(mouvement.escale, {
            etat: partiEtat._id,
            zone: outsideZone._id
        }, {new: true})
    }
    res.status(200).json({
        status: "Success",
        message: "Mouvement updated",
    })

});



