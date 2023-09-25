const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const Quai = require('../model/Quai');
const TypeOperation = require('../model/TypeOperation');
const TypeMouvement = require('../model/TypeMouvement');
const Marchandise = require('../model/Marchandise');
const Conditionnement = require('../model/Conditionnement');
const PositionNavire = require('../model/PositionNavire');
const Operation = require('../model/Operation');
const Mouvement = require('../model/Mouvement');
const Prestataire = require('../model/Prestataire');
const Prestation = require('../model/Prestation');
const ServiceAssistance = require('../model/ServiceAssistance');
const User = require('../model/User');
const Privilege = require("../model/Privilege");
const Demande = require("../model/Demande");
const Agence = require("../model/Agence");
const Acconier = require("../model/Acconier");
const Notification = require("../model/Notification");


exports.createEscale = AsyncHandler(async (req, res) => {
    const {
        navire,
        agence,
        acconier,
        quai,
        date_accostage_prevue,
        date_appareillage_prevue,
        heure_accostage_prevue,
        heure_appareillage_prevue,
        operations,
        is_commerciale
    } = req.body;

    const userAuth = req.userAuth;
    const acconierExist = await Acconier.findById(acconier);
    const outsideZone = await Zone.findOne().where('code').equals('OUTSIDE');
    const prevueEtat = await Etat.findOne().where('code').equals('PREVUE');
    const waitingEtat = await Etat.findOne().where('code').equals('EN_ATTENTE');
    const navireExist = await Navire.findById(navire);
    const agenceExist = await Agence.findById(agence);
    const quaiExist = await Quai.findById(quai);
    const defautPrestataire = await Prestataire.findOne().where('code').equals('PAC');
    const commandeEtat = await Etat.findOne().where('code').equals('COMMANDEE');
    const userDefaultRessource = await User.findOne().where('username').equals('default');
    const serviceAssistances = await ServiceAssistance.find().where('auto_generated').equals(true);

    const escaleCreate = await Escale.create({

        acconier: acconierExist._id,
        agence: agenceExist._id,
        user: userAuth._id,
        zone: outsideZone._id,
        etat: prevueEtat._id,
        navire: navireExist._id,
        quai: quaiExist._id,
        date_accostage_prevue,
        date_appareillage_prevue,
        heure_accostage_prevue,
        heure_appareillage_prevue,
        is_commerciale,
        date_accostage_estimee : date_accostage_prevue,
        date_appareillage_estimee: date_appareillage_prevue,
        heure_accostage_estimee : heure_accostage_prevue,
        heure_appareillage_estimee : heure_appareillage_prevue,
    });

    await Demande.create({
        user: req.userAuth._id,
        incoming: true,
        escale: escaleCreate._id,
        etat: waitingEtat._id,
        date:date_accostage_prevue,
        heure: heure_accostage_prevue,
    });

    await Demande.create({
        user: req.userAuth._id,
        incoming: false,
        escale: escaleCreate._id,
        etat: waitingEtat._id,
        date:date_appareillage_prevue,
        heure: heure_appareillage_prevue,
    });

    for (const operation of operations) {
        const typeOperationExist = await TypeOperation.findById(operation.typeOperation);
        const marchandiseExist = await Marchandise.findById(operation.marchandise);
        const conditionnementExist = await Conditionnement.findById(operation.conditionnement);
        if (typeOperationExist && marchandiseExist && conditionnementExist) {

             await Operation.create({
                escale: escaleCreate._id,
                typeOperation: typeOperationExist._id,
                marchandise: marchandiseExist._id,
                conditionnement: conditionnementExist._id,
                nombre_prevu: operation.nombre_prevu,
                tonnage_prevu: operation.tonnage_prevu
            })
            /* if (operationCreate) {
                for (const mouvement of operation.mouvements) {
                    const typeMouvementExist = await TypeMouvement.findById(mouvement.typeMouvement);
                    const positionNavireExist = await PositionNavire.findById(mouvement.positionNavire);
                    const berthZoneExist = await Zone.findOne().where('code').equals('BERTH');
                    const quaiMouvementExist = await Quai.findById(mouvement.quai);
                    if (typeMouvementExist && positionNavireExist && berthZoneExist && quaiMouvementExist) {
                        const createMouvement = await Mouvement.create({
                            operation: operationCreate._id,
                            typeMouvement: typeMouvementExist._id,
                            positionNavire: positionNavireExist._id,
                            zone: berthZoneExist._id,
                            etat: prevueEtat._id,
                            quai: quaiMouvementExist._id,
                            date_accostage_prevue: mouvement.date_accostage_prevue,
                            date_appareillage_prevue: mouvement.date_appareillage_prevue,
                            heure_accostage_prevue: mouvement.heure_accostage_prevue,
                            heure_appareillage_prevue: mouvement.heure_appareillage_prevue,
                            nombre_remorque_demande: mouvement.nombre_remorque_demande
                        });

                        await Operation.findByIdAndUpdate(
                            operationCreate._id,
                            { $push: { mouvements: createMouvement._id } },
                            { new: true, useFindAndModify: false }
                        );
                    }
                }
            } */
        }
    }

    for (const serviceAssistance of serviceAssistances) {
        await Prestation.create({
            prestataire: defautPrestataire._id,
            user: userDefaultRessource._id,
            serviceAssistance: serviceAssistance._id,
            date_commande: escaleCreate.date_accostage_prevue,
            heure_commande: escaleCreate.heure_accostage_prevue,
            escale: escaleCreate._id,
            etat: commandeEtat._id
        })
        await Prestation.create({
            prestataire: defautPrestataire._id,
            user: userDefaultRessource._id,
            serviceAssistance: serviceAssistance._id,
            date_commande: escaleCreate.date_appareillage_prevue,
            heure_commande: escaleCreate.heure_appareillage_prevue,
            etat: commandeEtat._id,
            escale: escaleCreate._id,
            type_prestation: 'Sortie',
        })
    }


    const users = await User.find().where('fonction').equals('Capitaine');
    const message = `Le consigntaire ${req.userAuth.lastname} ${req.userAuth.firstname}a crée une escale pour le navire ${navireExist.nom}`
    for (const receiver of users) {
        const notification = new Notification({ sender: req.userAuth._id, receivers: [receiver], message});
        await notification.save();
    }
    res.status(201).json({
        status: "Success",
        message: "L'escale a été crée avec succès",
        data: escaleCreate,
    })
});

exports.getEscales = AsyncHandler(async (req, res) => {

    const escales = await Escale.find()
        .populate('navire')
        .populate('etat')
        .populate('zone')
        .populate('quai')
        .populate('agence')
        .populate({ path: 'user',
            populate: [
                { path: 'agence', model: 'Agence' },
            ],}).populate('acconier');
    res.status(200).json({
        status: "Success",
        message: "La liste des escales a été récupérée avec succès",
        data: escales
    })

});

exports.getEscale = AsyncHandler(async (req, res) => {
    const escale = await Escale.findById(req.params.id).populate('navire').populate('etat').populate('zone').populate('quai').populate('user').populate('acconier').populate('agence');
    res.status(200).json({
        status: "Success",
        message: "L'escale a été récupéré avec succès",
        data: escale
    })
});

exports.getEscaleOperations = AsyncHandler(async (req, res) => {
    const operations = await Operation.find().where('escale').equals(req.params.id)
        .populate('marchandise')
        .populate('typeOperation')
        .populate('conditionnement')
        .populate({ path: 'mouvements',
            populate: [
                { path: 'etat', model: 'Etat' },
                { path: 'zone', model: 'Zone' },
                { path: 'typeMouvement', model: 'TypeMouvement' },
                { path: 'positionNavire', model: 'PositionNavire' },
                { path: 'quai', model: 'Quai' },
            ],});


    res.status(200).json({
        status: "Success",
        message: "La liste des escales a été récupérée avec succès",
        data: operations
    })

});

exports.getEscalePrestations = AsyncHandler(async (req, res) => {

    const operations = await Operation.find().where('escale').equals(req.params.id);

    let mouvementIds = []
    for (operation of operations) {
        mouvementIds.push(operation.mouvements)
    }

    const prestations = await Prestation.find({ mouvement: { $in: mouvementIds } }).populate('user').populate('mouvement').populate('serviceAssistance').populate('etat');

    res.status(200).json({
        status: "Success",
        message: "La liste des prestations de l'escale a été récupérée avec succès",
        data: prestations
    })

});
exports.getEscaleMouvements = AsyncHandler(async (req, res) => {

    const operations = await Operation.find().where('escale').equals(req.params.id);
    let mouvementIds = []
    for (operation of operations) {
        mouvementIds.push(operation.mouvements)
    }

    const mouvements = await Mouvement.find({ _id: { $in: mouvementIds } }).populate('typeMouvement').populate('quai');

    res.status(200).json({
        status: "Success",
        message: "La liste des mouvements de l'escale a été récupérée avec succès",
        data: mouvements
    })

});

exports.scheduleArrivalEscale = AsyncHandler(async (req, res) => {

});
