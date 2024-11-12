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
const DossierEscale = require("../model/DossierEscale");
const TypeDocument = require("../model/TypeDocument");
const Document = require("../model/Document");
const ExcelJS = require('exceljs');
const {hashPassword} = require("../utils/helpers");


exports.createEscale = AsyncHandler(async (req, res) => {


    const today = new Date();

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
        is_commerciale,
        is_dangerous
    } = req.body;

    const userAuth = req.userAuth;

    const outsideZone = await Zone.findOne().where('code').equals('OUTSIDE');
    const prevueEtat = await Etat.findOne().where('code').equals('PREVUE');
    const waitingEtat = await Etat.findOne().where('code').equals('EN_ATTENTE');
    const navireExist = await Navire.findById(navire);
    const berthZoneExist = await Zone.findOne().where('code').equals('BERTH');

    const quaiExist = await Quai.findById(quai);
    const defautPrestataire = await Prestataire.findOne().where('code').equals('PAC');
    const commandeEtat = await Etat.findOne().where('code').equals('COMMANDEE');
    const userDefaultRessource = await User.findOne().where('username').equals('default');
    const serviceAssistances = await ServiceAssistance.find().where('auto_generated').equals(true);
    const typeDocuments = await TypeDocument.find();


    const escales = await Escale.find({
        navire: navireExist._id,
        date_accostage_estimee: date_accostage_prevue,
    });

    if (escales.length > 0) {
        res.status(203).json({
            status: "Warning",
            message: "Escale existe déjà",
        })
    }
    const escaleCreate = await Escale.create({

        acconier: acconier,
        agence: agence,
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
        is_dangerous,
        date_accostage_estimee: date_accostage_prevue,
        date_appareillage_estimee: date_appareillage_prevue,
        heure_accostage_estimee: heure_accostage_prevue,
        heure_appareillage_estimee: heure_appareillage_prevue,
    });

    const dossierEscale = await DossierEscale.create({
        escale: escaleCreate._id,
        date_accostage_estimee: date_accostage_prevue,
        heure_accostage_estimee: heure_accostage_prevue,
        agence: agence,
        pol: 'n/a', atp: 'n/a', numero_escale: escaleCreate.numero_voyage,
        date_appareillage_estimee: date_appareillage_prevue,
        heure_appareillage_estimee: heure_appareillage_prevue,
        pod: 'n/a',
        tel: '/a',
        etat: prevueEtat._id,
        date_arrivee_rade: '',
        heure_arrivee_rade: '',
        date_arrivee_mouillage: '',
        heure_arrivee_mouillage: '',
        motif_attente: '', sejour_rade: '', date_accostage: '',
        heure_accostage: '', entree_tirant_eau_arr: '',
        entree_tirant_eau_av: '',
        date_accostage_prevue: '',
        heure_accostage_prevue: '',
        cause_retard: '',
        sejour_prevu: '',
        date_depart_rade: '',
        heure_depart_rade: '',
        date_depart_mouillage: '',
        heure_depart_mouillage: '',
        date_appareillage: '',
        heure_appareillage: '',
        sortie_tirant_eau_arr: '',
        sortie_tirant_eau_av: '',
        date_appareillage_prevue: '',
        heure_appareillage_prevue: '',
        sejour_effectif: '',
        sejour_duree: ''
    })

    await Demande.create({
        user: req.userAuth._id,
        incoming: true,
        escale: escaleCreate._id,
        etat: waitingEtat._id,
        date: date_accostage_prevue,
        heure: heure_accostage_prevue,
    });

    await Demande.create({
        user: req.userAuth._id,
        incoming: false,
        escale: escaleCreate._id,
        etat: waitingEtat._id,
        date: date_appareillage_prevue,
        heure: heure_appareillage_prevue,
    });
    if (is_commerciale) {
        for (const operation of operations) {
            const conditionnementExist = await Conditionnement.findById(operation.conditionnement);

            const operationCreated = await Operation.create({
                escale: escaleCreate._id,
                typeOperation: operation.typeOperation,
                marchandise: operation.marchandise,
                conditionnement: operation.conditionnement,
                nombre_prevu: operation.nombre_prevu,
                tonnage_prevu: operation.tonnage_prevu
            })

            await Escale.findByIdAndUpdate(escaleCreate._id, {
                $push: {operations: operationCreated._id},
            }, {new: true})


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

    await Mouvement.create({
        escale: escaleCreate._id,
        type: 'Entrée',
        mouvement_accostage: 'Entrée',
        mouvement_appareillage: 'Sortie',
        date_accostage_prevue: escaleCreate.date_accostage_estimee,
        heure_accostage_prevue: escaleCreate.heure_accostage_estimee,
        date_appareillage_prevue: escaleCreate.date_appareillage_estimee,
        heure_appareillage_prevue: escaleCreate.heure_appareillage_estimee,
        pab_accostage_date: escaleCreate.date_accostage_estimee,
        pab_accostage_heure: escaleCreate.heure_accostage_estimee,
        pab_appareillage_date: escaleCreate.date_appareillage_estimee,
        pab_appareillage_heure: escaleCreate.heure_appareillage_estimee,
        quai: escaleCreate.quai._id,
        etat: prevueEtat._id,
        zone: berthZoneExist._id
    })
    await Mouvement.create({
        escale: escaleCreate._id,
        type: 'Sortie',
        mouvement_accostage: 'Entrée',
        mouvement_appareillage: 'Sortie',
        date_accostage_prevue: escaleCreate.date_accostage_estimee,
        heure_accostage_prevue: escaleCreate.heure_accostage_estimee,
        date_appareillage_prevue: escaleCreate.date_appareillage_estimee,
        heure_appareillage_prevue: escaleCreate.heure_appareillage_estimee,
        pab_accostage_date: escaleCreate.date_accostage_estimee,
        pab_accostage_heure: escaleCreate.heure_accostage_estimee,
        pab_appareillage_date: escaleCreate.date_appareillage_estimee,
        pab_appareillage_heure: escaleCreate.heure_appareillage_estimee,
        quai: escaleCreate.quai._id,
        etat: prevueEtat._id,
        zone: berthZoneExist._id
    })


    for (const typeDoc of typeDocuments) {
        await Document.create({
            escale: escaleCreate._id,
            typeDocument: typeDoc._id,
            etat: waitingEtat._id,
        })
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
    const messageEscale = `Le consignataire ${req.userAuth.lastname} ${req.userAuth.firstname} a annoncé une escale (ID Escale : ${escaleCreate._id}) pour le navire ${navireExist.nom} dont l' ETA est le ${date_accostage_prevue} à ${heure_accostage_prevue} le quai sollicité est le quai : ${quaiExist.code}. `
    const messageDemandeEntree = `Le consignataire ${req.userAuth.lastname} ${req.userAuth.firstname} a effectué une demande d'entrée (ID Escale : ${escaleCreate._id}) du navire ${navireExist.nom} le ${date_accostage_prevue} à ${heure_accostage_prevue}. `
    const messageDemandeSortie = `Le consignataire ${req.userAuth.lastname} ${req.userAuth.firstname} a effectué une demande de sortie (ID Escale : ${escaleCreate._id}) du navire ${navireExist.nom} le ${date_appareillage_prevue} à ${heure_appareillage_prevue}. `
    for (const receiver of users) {
        const notificationEscale = new Notification({
            sender: req.userAuth._id,
            receivers: [receiver],
            message: messageEscale
        });
        const notificationDemandeEntree = new Notification({
            sender: req.userAuth._id,
            receivers: [receiver],
            message: messageDemandeEntree
        });
        const notificationDemandeSortie = new Notification({
            sender: req.userAuth._id,
            receivers: [receiver],
            message: messageDemandeSortie
        });
        await notificationEscale.save();
        await notificationDemandeEntree.save();
        await notificationDemandeSortie.save();
    }
    await Escale.findByIdAndUpdate(escaleCreate._id, {
        dossierEscale: dossierEscale._id,
    }, {new: true})
    res.status(201).json({
        status: "Success",
        message: "L'escale a été crée avec succès",
        data: escaleCreate,
    })
});

exports.getEscales = AsyncHandler(async (req, res) => {

    const escales = await Escale.find().sort('-createdAt')
        .populate('navire', {nom: 1})
        .populate('etat', {libelle: 1, code: 1})
        .populate('dossierEscale')
        .populate('zone', {libelle: 1})
        .populate('quai', {code: 1})
        .populate('agence', {libelle: 1})
        .populate('user', {firstname: 1, lastname: 1}).populate('acconier', {libelle: 1});
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


exports.getShippingEscales = AsyncHandler(async (req, res) => {
    const axios = require('axios');

    const response = await axios.get(`https://www.shippingexplorer.net/api/ad_cotonou`);
    res.status(200).json({
        status: "Success",
        message: "La liste des escales a été récupérée avec succès",
        data: response.data
    })
});


exports.getEscaleOperations = AsyncHandler(async (req, res) => {
    const operations = await Operation.find().where('escale').equals(req.params.id)
        .populate('marchandise')
        .populate('typeOperation')
        .populate('conditionnement')


    res.status(200).json({
        status: "Success",
        message: "La liste des escales a été récupérée avec succès",
        data: operations
    })

});

exports.getEscalePrestations = AsyncHandler(async (req, res) => {

    const prestations = await Prestation.find().where('escale').equals(req.params.id).populate('user').populate('mouvement').populate('serviceAssistance').populate('etat').populate('escale');

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

    const mouvements = await Mouvement.find({_id: {$in: mouvementIds}}).populate('typeMouvement').populate('quai');

    res.status(200).json({
        status: "Success",
        message: "La liste des mouvements de l'escale a été récupérée avec succès",
        data: mouvements
    })

});

exports.getSituations = AsyncHandler(async (req, res) => {
    const date = new Date();
    const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const outsideZone = await Zone.findOne().where('code').equals('OUTSIDE');
    const berthZone = await Zone.findOne().where('code').equals('BERTH');
    const anchorageZone = await Zone.findOne().where('code').equals('ANCHORAGE');
    const habourZone = await Zone.findOne().where('code').equals('HARBOUR');
    const prevueEtat = await Etat.findOne().where('code').equals('PREVUE');

    const allEscales = await Escale.find().sort('-createdAt')
        .populate('navire')
        .populate('etat', {libelle: 1})
        .populate({
            path: 'operations',
            populate: [
                {path: 'marchandise', model: 'Marchandise',},
                {path: 'typeOperation', model: 'TypeOperation'},
                {path: 'conditionnement', model: 'Conditionnement'},
            ],
        })
        .populate('dossierEscale')
        .populate('zone', {libelle: 1})
        .populate('quai', {libelle: 1})
        .populate('agence', {libelle: 1})
        .populate('user', {firstname: 1, lastname: 1})
        .populate('acconier', {libelle: 1});


    const allMouvements = await Mouvement.find({})
        .populate('etat', {libelle: 1, code: 1})
        .populate('zone', {libelle: 1})
        .populate('quai', {libelle: 1}).populate({
            path: 'escale',
            populate: [
                {path: 'agence', model: 'Agence'},
                {path: 'navire', model: 'Navire'},
                {path: 'dossierEscale', model: 'DossierEscale'},
            ],
        });


    const escalesAttendus = allEscales
        .filter(escale => {
            const escaleDate = new Date(escale.date_accostage_prevue);
            return (
                (escaleDate >= today) &&
                escale.etat?.equals(prevueEtat._id) &&
                escale.zone?.equals(outsideZone._id)
            );
        })
        .sort((a, b) => new Date(a.date_accostage_prevue) - new Date(b.date_accostage_prevue));

    const escalesAttendusNonMisAJour = allEscales.filter(escale => {
        const escaleDate = new Date(escale.date_accostage_prevue);
        return (
            escaleDate < today &&
            escale.etat?.equals(prevueEtat._id)
        );
    });

    const naviresDansLePort = allEscales.filter(escale => {
        return (
            escale.zone?.equals(berthZone._id)
        )
    })

    const naviresAuMouillage = allEscales.filter(escale => {
        return (
            escale.zone?.equals(anchorageZone._id) ||
            escale.zone?.equals(habourZone._id)
        )
    })

    const mouvementsAccostageProgrammesDuJour = allMouvements.filter(movement => {
        const movementAccostageDate = new Date(movement.date_accostage_prevue).toISOString().split('T')[0];
        return movementAccostageDate === today.toISOString().split('T')[0] && movement.etat.code === 'PROGRAMME_EN_ENTREE'

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

    const mouvementsAppareillageProgrammesDuJour = allMouvements.filter(movement => {
        const movementAppareillageDate = new Date(movement.date_appareillage_prevue).toISOString().split('T')[0];
        return movementAppareillageDate === today.toISOString().split('T')[0] && movement.etat.code === 'PROGRAMMER_EN_SORTIE';
    });

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
        message: "La liste des escales a été récupérée avec succès",
        data: {
            escalesAttendus: escalesAttendus,
            escalesAttendusNonMisAJour: escalesAttendusNonMisAJour,
            naviresDansLePort: naviresDansLePort,
            naviresAuMouillage: naviresAuMouillage,
            mouvementsProgrammesDuJour: mouvementsProgrammesDuJour,
            mouvementsProgrammesDuJourPlusUn: mouvementsProgrammesDuJourPlusUn,
        }
    })
})

exports.getSituationsTest = AsyncHandler(async (req, res) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [outsideZone, berthZone, anchorageZone, harbourZone, prevueEtat] = await Promise.all([
        Zone.findOne({code: 'OUTSIDE'}),
        Zone.findOne({code: 'BERTH'}),
        Zone.findOne({code: 'ANCHORAGE'}),
        Zone.findOne({code: 'HARBOUR'}),
        Etat.findOne({code: 'PREVUE'}),
    ]);

    const allEscales = await Escale.find()
        .sort('-createdAt')
        .populate('navire')
        .populate('etat', {libelle: 1})
        .populate({
            path: 'operations',
            populate: [
                {path: 'marchandise', model: 'Marchandise'},
                {path: 'typeOperation', model: 'TypeOperation'},
                {path: 'conditionnement', model: 'Conditionnement'},
            ],
        })
        .populate('dossierEscale')
        .populate('zone', {libelle: 1})
        .populate('quai', {libelle: 1})
        .populate('agence', {libelle: 1})
        .populate('user', {firstname: 1, lastname: 1})
        .populate('acconier', {libelle: 1});

    const allMouvements = await Mouvement.find({})
        .populate('etat', {libelle: 1, code: 1})
        .populate('zone', {libelle: 1})
        .populate('quai', {libelle: 1})
        .populate({
            path: 'escale',
            populate: [{path: 'agence', model: 'Agence'}, {path: 'navire', model: 'Navire'}],
        });

    const filterByDateAndCode = (movements, date, codes) =>
        movements.filter(movement => {
            const movementDate = new Date(movement.date_accostage_prevue).toISOString().split('T')[0];
            return movementDate === date.toISOString().split('T')[0] && codes.includes(movement.etat.code);
        });

    const mouvementsProgrammesDuJour = filterByDateAndCode(allMouvements, today, ['PROGRAMME_EN_ENTREE', 'PROGRAMMER_EN_SORTIE', 'QUAI', 'PARTI']);
    const mouvementsProgrammesDuJourPlusUn = filterByDateAndCode(allMouvements, tomorrow, ['PROGRAMME_EN_ENTREE', 'PROGRAMMER_EN_SORTIE', 'QUAI', 'PARTI']);

    return res.status(200).json({
        status: "Success",
        message: "La liste des escales a été récupérée avec succès",
        data: {
            escalesAttendus: allEscales.filter(escale =>
                new Date(escale.date_accostage_prevue) >= today &&
                escale.etat?.equals(prevueEtat._id) &&
                escale.zone?.equals(outsideZone._id)
            ),
            escalesAttendusNonMisAJour: allEscales.filter(escale =>
                new Date(escale.date_accostage_prevue) < today &&
                escale.etat.equals(prevueEtat._id)
            ),
            naviresDansLePort: allEscales.filter(escale => escale.zone.equals(berthZone._id)),
            naviresAuMouillage: allEscales.filter(escale => escale.zone.equals(anchorageZone._id) || escale.zone.equals(harbourZone._id)),
            mouvementsProgrammesDuJour,
            mouvementsProgrammesDuJourPlusUn,
        },
    });
});

exports.updateEtaEscale = AsyncHandler(async (req, res) => {
    const idEscale = req.params.id;
    const escale = await Escale.findById(idEscale);
    const demande = await Demande.findOne().where('escale').equals(escale).where('incoming').equals(true);
    const {date, heure} = req.body;
    if (!escale) {
        throw new Error(`L'escale n'existe pas`);
    }
    const updateEscaleEta = await Escale.findByIdAndUpdate(idEscale, {
        date_accostage_estimee: date,
        heure_accostage_estimee: heure,
        date_accostage_prevue: date,
        heure_accostage_prevue: heure
    }, {new: true})

    await Demande.findByIdAndUpdate(demande._id, {
        date,
        heure,
    }, {new: true})

    await DossierEscale.findByIdAndUpdate(escale.dossierEscale, {
        date_accostage_estimee: date,
        heure_accostage_estimee: heure,
        date_accostage_prevue: date,
        heure_accostage_prevue: heure
    }, {new: true})

    res.status(200).json({
        status: "Success",
        message: "L'ETA a été modifié avec succès",
        data: updateEscaleEta
    })

});

exports.updateEtdEscale = AsyncHandler(async (req, res) => {
    const idEscale = req.params.id;
    const escale = await Escale.findById(idEscale);
    const prevueEtat = await Etat.findOne().where('code').equals('PREVUE');
    const demande = await Demande.findOne().where('escale').equals(escale).where('incoming').equals(false);
    const {date, heure} = req.body;
    if (!escale) {
        throw new Error(`L'escale n'existe pas`);
    }
    const updateEscaleEta = await Escale.findByIdAndUpdate(idEscale, {
        date_appareillage_estimee: date,
        heure_appareillage_estimee: heure,
        date_appareillage_prevue: date,
        heure_appareillage_prevue: heure,
        etat: prevueEtat._id
    }, {new: true})

    await Demande.findByIdAndUpdate(demande._id, {
        date,
        heure,
    }, {new: true})

    await DossierEscale.findByIdAndUpdate(escale.dossierEscale, {
        date_appareillage_estimee: date,
        heure_appareillage_estimee: heure,
        date_appareillage_prevue: date,
        heure_appareillage_prevue: heure
    }, {new: true})

    res.status(200).json({
        status: "Success",
        message: "L'ETA a été modifié avec succès",
        data: updateEscaleEta
    })

});

exports.getDossierEscale = AsyncHandler(async (req, res) => {

    const escale = await Escale.findById(req.params.id);

    if (!escale) {
        throw new Error(`L'escale n'existe pas`);
    }

    const dossierEscale = await DossierEscale.findOne().where('escale').equals(escale._id).populate('escale').populate('etat').populate('agence');
    return res.status(200).json({
        status: "Success",
        message: "Le dossier de l'escale a été récupérée avec succès",
        data: dossierEscale
    })


});

exports.updateQuaiEscale = AsyncHandler(async (req, res) => {
    const idEscale = req.params.id;
    const escale = await Escale.findById(idEscale);
    const {quai} = req.body;
    if (!escale) {
        throw new Error(`L'escale n'existe pas`);
    }
    const updateEscaleQUAI = await Escale.findByIdAndUpdate(idEscale, {
        quai,
    }, {new: true})

    res.status(200).json({
        status: "Success",
        message: "Le quai a été modifié avec succès",
        data: updateEscaleQUAI
    })

});


exports.updateZoneEscale = AsyncHandler(async (req, res) => {
    const idEscale = req.params.id;
    const escale = await Escale.findById(idEscale);
    const {zone} = req.body;
    if (!escale) {
        throw new Error(`L'escale n'existe pas`);
    }
    const updateEscaleQUAI = await Escale.findByIdAndUpdate(idEscale, {
        zone,
    }, {new: true})

    res.status(200).json({
        status: "Success",
        message: "La zone a été modifié avec succès",
        data: updateEscaleQUAI
    })

});

exports.updateEtatEscale = AsyncHandler(async (req, res) => {
    const idEscale = req.params.id;
    const escale = await Escale.findById(idEscale);
    const {etat} = req.body;
    if (!escale) {
        throw new Error(`L'escale n'existe pas`);
    }
    const updateEscaleQUAI = await Escale.findByIdAndUpdate(idEscale, {
        etat,
    }, {new: true})

    res.status(200).json({
        status: "Success",
        message: "La situation a été modifié avec succès",
        data: updateEscaleQUAI
    })

});


exports.updateDossierEscale = AsyncHandler(async (req, res) => {

    const escaleId = req.params.id;
    const escale = await Escale.findById(escaleId);
    const dossierEscale = await DossierEscale.findOne().where('escale').equals(escaleId);
    const {date_arrivee_rade, heure_arrivee_rade, date_arrivee_mouillage, heure_arrivee_mouillage} = req.body
    const {date_depart_rade, heure_depart_rade, date_depart_mouillage, heure_depart_mouillage} = req.body
    const radeZone = await Zone.findOne().where('code').equals('HARBOUR');
    const extZone = await Zone.findOne().where('code').equals('OUTSIDE');
    const mouillageZone = await Zone.findOne().where('code').equals('ANCHORAGE');
    if (!dossierEscale.date_arrivee_rade && !dossierEscale.heure_arrivee_rade && date_arrivee_rade, heure_arrivee_rade) {
        await Escale.findByIdAndUpdate(escaleId, {zone: radeZone._id}, {
            new: true
        })
    }

    if (!dossierEscale.date_arrivee_mouillage && !dossierEscale.heure_arrivee_mouillage && date_arrivee_mouillage, heure_arrivee_mouillage) {
        await Escale.findByIdAndUpdate(escaleId, {zone: mouillageZone._id}, {
            new: true
        })
    }


    if (!dossierEscale.date_depart_rade && !dossierEscale.heure_depart_rade && date_depart_rade, heure_depart_rade) {
        await Escale.findByIdAndUpdate(escaleId, {zone: extZone._id}, {
            new: true
        })
    }

    if (!dossierEscale.date_depart_mouillage && !dossierEscale.heure_depart_mouillage && date_depart_mouillage, heure_depart_mouillage) {
        await Escale.findByIdAndUpdate(escaleId, {zone: radeZone._id}, {
            new: true
        })
    }


    const dossierEscaleUpdate = await DossierEscale.findByIdAndUpdate(dossierEscale._id, req.body, {
        new: true,
    })

    return res.status(200).json({
        status: "Success",
        message: "Le dossier de l'escale a été modifié avec succès",
        data: dossierEscaleUpdate
    })


});


exports.getDocuments = AsyncHandler(async (req, res) => {
    const escaleDocuments = await Document.find().where('escale').equals(req.params.id).populate('typeDocument').populate('etat');

    return res.status(200).json({
        status: "Success",
        message: "Le dossier de l'escale a été récupérer avec succès",
        data: escaleDocuments
    })


});


exports.situationsPortToExcel = AsyncHandler(async (req, res) => {

    const workbook = new ExcelJS.Workbook();

    const sheetsData = {
        'NAVIRES ATTENDUS': [
            ['NAVIRE', 'ETA', 'HEURE', 'LONG', 'TE AV', 'TE AR', 'CARG,(IMP)', 'TON', 'CARG,(EXP)', 'TON', 'AGENCE'],
            ['MSC SANTHYA', '2023-09-13', '15H00', '', '', '', '', '', '', '', 'MSC BENIN'],
            ['IBERIAN', '2023-09-14', '03H00', '180', '', '', '', '', '', '', 'AGL']
        ],
        'NAVIRES AU MOUILLAGE': [
            ['NAVIRE', 'ARR,RADE', 'A', 'MOUILLAGE', 'A', 'REMOUILLAGE', 'LONGUEUR', 'TE AV'],
            ['CMA CGM RABELAIS', '2023-09-09 19H35', '23H30', '2023-09-09', '', '', '300', '10.6']
        ],
        'NAVIRES DANS LE PORT': [
            ['NAVIRE', 'ARRIVÉE', 'HEURE', 'LONG', 'TE AV', 'TE AR', 'QUAI', 'SÉJOUR'],
            ['MSC SANTHYA', '2023-09-16', '12H00', '', '', '', 'Q5', '2 jours']
        ],
        'PROGRAMME DU JOUR': [
            ['TYPE DE MANŒUVRE', 'STATUT', 'HEURE', 'NAVIRE', 'LOA', 'TE AV', 'TE AR', 'QUAI', 'CONSIGNATAIRE'],
            ['APPAREILLAGE', 'NON RÉALISÉ', '16H00', 'CMA CGM CHIWAN', '261', '', '', 'Q10', 'CMA CGM B']
        ],
        'PROGRAMME DU JOUR +1': [
            ['TYPE DE MANŒUVRE', 'STATUT', 'HEURE', 'NAVIRE', 'LOA', 'TE AV', 'TE AR', 'QUAI', 'CONSIGNATAIRE'],
            ['APPAREILLAGE', 'NON RÉALISÉ', '02H00', 'RANGIROA', '93', '', '', 'QC', ''],
            ['APPAREILLAGE', 'NON RÉALISÉ', '07H00', 'MAERSK CUBANGO', '', '', '', 'Q9', 'SHARAF']
        ]
    };

    // Créer chaque feuille et ajouter les données
    for (const [sheetName, data] of Object.entries(sheetsData)) {
        const sheet = workbook.addWorksheet(sheetName);
        data.forEach(row => sheet.addRow(row));
    }


    // Sauvegarder le fichier
    try {
        await workbook.xlsx.writeFile('Recap_Complet.xlsx');
        console.log('Le fichier Excel a été créé avec succès!');
    } catch (error) {
        console.error('Erreur lors de la création du fichier Excel:', error);
    }
});


