const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const DossierEscale = require('../model/DossierEscale');
const Mouvement = require('../model/Mouvement');


exports.getMouvements = AsyncHandler(async (req, res) => {
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Ajouter une marge de 72h aux dates actuelles
    const todayPlus72h = new Date(today);
    todayPlus72h.setHours(todayPlus72h.getHours() + 72);
    const tomorrowPlus72h = new Date(tomorrow);
    tomorrowPlus72h.setHours(tomorrowPlus72h.getHours() + 72);

    const allMouvements = await Mouvement.find({})
        .populate('etat', { libelle: 1, code: 1 })
        .populate('zone', { libelle: 1 })
        .populate('quai', { libelle: 1 })
        .populate({
            path: 'escale',
            populate: [
                { path: 'agence', model: 'Agence' },
                { path: 'navire', model: 'Navire' },
                { path: 'dossierEscale', model: 'DossierEscale' },
            ],
        });

    const filterMovements = (mouvements, dateStart, dateEnd, code) => mouvements.filter(movement => {
        const accostageDate = new Date(movement.date_accostage_prevue);
        const appareillageDate = new Date(movement.date_appareillage_prevue);
        return (
            (accostageDate >= dateStart && accostageDate <= dateEnd && movement.etat.code === code) ||
            (appareillageDate >= dateStart && appareillageDate <= dateEnd && movement.etat.code === code)
        );
    });

    // Mouvements programmés du jour avec 72h de marge
    const mouvementsProgrammesDuJour = filterMovements(allMouvements, today, todayPlus72h, 'PROGRAMME_EN_ENTREE')
        .concat(filterMovements(allMouvements, today, todayPlus72h, 'PROGRAMMER_EN_SORTIE'));

    // Mouvements programmés pour demain avec 72h de marge
    const mouvementsProgrammesDuJourPlusUn = filterMovements(allMouvements, tomorrow, tomorrowPlus72h, 'PROGRAMME_EN_ENTREE')
        .concat(filterMovements(allMouvements, tomorrow, tomorrowPlus72h, 'PROGRAMMER_EN_SORTIE'));

    return res.status(200).json({
        status: "Success",
        message: "La liste des mouvements a été récupérée avec succès",
        data: {
            mouvementsProgrammesDuJour: mouvementsProgrammesDuJour,
            mouvementsProgrammesDuJourPlusUn: mouvementsProgrammesDuJourPlusUn,
        },
    });
});

exports.getMouvementsTEST2 = AsyncHandler(async (req, res) => {
    const date = new Date();
    const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const allMouvements = await Mouvement.find({})
        .populate('etat', {libelle: 1, code: 1})
        .populate('zone', {libelle: 1})
        .populate('quai', {libelle: 1})
        .populate('quai', {libelle: 1}).populate({
            path: 'escale',
            populate: [
                {path: 'agence', model: 'Agence'},
                {path: 'navire', model: 'Navire'},
                {path: 'dossierEscale', model: 'DossierEscale'},
            ],
        });;

    const mouvementsAccostageProgrammesDuJour = allMouvements.filter(movement => {
        const movementAccostageDate = new Date(movement.date_accostage_prevue).toISOString().split('T')[0];
        return movementAccostageDate === today.toISOString().split('T')[0] && movement.etat.code === 'PROGRAMME_EN_ENTREE'

    });
    const mouvementsAppareillageProgrammesDuJour = allMouvements.filter(movement => {
        const movementAppareillageDate = new Date(movement.date_appareillage_prevue).toISOString().split('T')[0];
        return movementAppareillageDate === today.toISOString().split('T')[0] && movement.etat.code === 'PROGRAMMER_EN_SORTIE';
    });

    const mouvementsAccostageRealiseDuJour = allMouvements.filter(movement => {
        const movementAccostageDate = new Date(movement.date_accostage_prevue).toISOString().split('T')[0];
        return movementAccostageDate === today.toISOString().split('T')[0] && movement.etat.code === 'QUAI'
    });

    const mouvementsAppareillageRealiseDuJour = allMouvements.filter(movement => {
        const movementAppareillageDate = new Date(movement.date_appareillage_prevue).toISOString().split('T')[0];
        return movementAppareillageDate === today.toISOString().split('T')[0] && movement.etat.code === 'PARTI'
    });

    const mouvementsRealiseDuJour = [...mouvementsAccostageRealiseDuJour, ...mouvementsAppareillageRealiseDuJour]


    const mouvementsProgrammesDuJour = [...mouvementsAccostageProgrammesDuJour, ...mouvementsAppareillageProgrammesDuJour].concat(mouvementsRealiseDuJour)

    const mouvementsAccostageProgrammesDuJourPlusUn = allMouvements.filter(movement => {
        const movementAccostageDate = new Date(movement.date_accostage_prevue).toISOString().split('T')[0];
        return movementAccostageDate === tomorrow.toISOString().split('T')[0] && movement.etat.code === 'PROGRAMME_EN_ENTREE'
    });

    const mouvementsAppareillageProgrammesDuJourPlusUn = allMouvements.filter(movement => {
        const movementAppareillageDate = new Date(movement.date_appareillage_prevue).toISOString().split('T')[0];
        return movementAppareillageDate === tomorrow.toISOString().split('T')[0] && movement.etat.code === 'PROGRAMMER_EN_SORTIE' // Additional state check
    });

    const mouvementsAccostageRealiseDuJourPlusUn = allMouvements.filter(movement => {
        const movementAccostageDate = new Date(movement.date_accostage_prevue).toISOString().split('T')[0];
        return movementAccostageDate === tomorrow.toISOString().split('T')[0] && movement.etat.code === 'QUAI'
    });

    const mouvementsAppareillageRealiseDuJourPlusUn = allMouvements.filter(movement => {
        const movementAppareillageDate = new Date(movement.date_appareillage_prevue).toISOString().split('T')[0];
        return movementAppareillageDate === tomorrow.toISOString().split('T')[0] && movement.etat.code === 'PARTI'
    });

    const mouvementsRealiseDuJourPlusUn = [...mouvementsAccostageRealiseDuJourPlusUn, ...mouvementsAppareillageRealiseDuJourPlusUn]


    const mouvementsProgrammesDuJourPlusUn = [...mouvementsAccostageProgrammesDuJourPlusUn, ...mouvementsAppareillageProgrammesDuJourPlusUn].concat(mouvementsRealiseDuJourPlusUn)

    return res.status(200).json({
        status: "Success",
        message: "La liste des mouvements a été récupérée avec succès",
        data: {
            mouvementsProgrammesDuJour: mouvementsProgrammesDuJour,
            mouvementsProgrammesDuJourPlusUn: mouvementsProgrammesDuJourPlusUn,
        }
    })
});

exports.getMouvementsTest = AsyncHandler(async (req, res) => {
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



