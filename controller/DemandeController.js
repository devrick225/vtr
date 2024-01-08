const AsyncHandler = require('express-async-handler');
const Demande = require('../model/Demande');
const Etat = require("../model/Etat");
const Escale = require("../model/Escale");
const User = require("../model/User");
const Notification = require("../model/Notification");
const DossierEscale = require("../model/DossierEscale");
const Mouvement = require("../model/Mouvement");


exports.createDemande = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const etatEnAttente = await Etat.findOne().where('code').equals('EN_ATTENTE');

    if (userAuth.userGroup.code !== 'CONSIGNATAIRE') {
        throw new Error('Seul les consignataires peuvent éffectuer une demande')
    }
    const {
        incoming,
        escale,
        date,
        heure,
    } = req.body;

    const escaleSearch = await Demande.findById(escale).populate('navire');

    const demandeCreated = await Demande.create({
        incoming,
        escale,
        etat: etatEnAttente._id,
        date,
        heure,
    })
    const users = await User.find().where('fonction').equals('Capitaine');
    let message = '';
    if (incoming) {
        message = `Le consignataire ${req.userAuth.lastname} ${req.userAuth.firstname} a effectué une demande d'entrée (ID Escale : ${escaleSearch._id}) du navire ${escaleSearch.navire.nom} le ${escaleSearch.date_accostage_prevue} à ${escaleSearch.heure_accostage_prevue}. `

    } else {
        message = `Le consignataire ${req.userAuth.lastname} ${req.userAuth.firstname} a effectué une demande de sortie (ID Escale : ${escaleSearch._id}) du navire ${escaleSearch.navire.nom} le ${escaleSearch.date_appareillage_prevue} à ${escaleSearch.heure_appareillage_prevue}. `

    }
    for (const receiver of users) {
        const notificationDemande = new Notification({sender: req.userAuth._id, receivers: [receiver], message});
        await notificationDemande.save();
    }
    res.status(201).json({
        status: "Success",
        message: "La demande a été crée avec succès",
        data: demandeCreated
    })
});


exports.getDemandes = AsyncHandler(async (req, res) => {
    const demandes = await Demande.find().sort('-createdAt')
        .populate({
            path: 'escale',
            populate: [
                {
                    path: 'user', model: 'User', populate: [
                        {path: 'agence', model: 'Agence'},
                    ],
                },
                {path: 'navire', model: 'Navire'},
                {path: 'quai', model: 'Quai'},
                {path: 'acconier', model: 'Acconier'},
            ],
        })

        .populate('etat').populate('user');
    res.status(200).json({
        status: "Success",
        message: "La liste des demandes a été récupérée avec succès",
        data: demandes
    })

});


exports.validateDemande = AsyncHandler(async (req, res) => {
    const etatValidate = await Etat.findOne().where('code').equals('VALIDEE');
    const etatEntry = await Etat.findOne().where('code').equals('PROGRAMME_EN_ENTREE');
    const etatOut = await Etat.findOne().where('code').equals('PROGRAMMER_EN_SORTIE');
    const demande = await Demande.findById(req.params.id)
    const dossierEscale = await DossierEscale.findOne().where('escale').equals(demande.escale);
    const mouvement = await Mouvement.findOne().where('escale').equals(demande.escale)

    const demandeChanged = await Demande.findByIdAndUpdate(
        req.params.id,
        {
            etat: etatValidate._id
        }, {
            new: true,
        }
    );
    if (demande.incoming) {
        await Escale.findByIdAndUpdate(demande.escale, {
            etat: etatEntry._id
        }, {new: true})

        await DossierEscale.findByIdAndUpdate(dossierEscale._id, {
            date_accostage_prevue: demande.date,
            heure_accostage_prevue: demande.heure
        }, {new: true})


        await Mouvement.findByIdAndUpdate(mouvement._id, {
            date_accostage_prevue: demande.date,
            heure_accostage_prevue: demande.heure,
            etat: etatEntry._id,
        }, {new: true})
    } else {
        await Escale.findByIdAndUpdate(demande.escale, {
            etat: etatOut._id
        }, {new: true})
        await DossierEscale.findByIdAndUpdate(dossierEscale._id, {
            date_appareillage_prevue: demande.date,
            heure_appareillage_prevue: demande.heure
        }, {new: true})

        await Mouvement.findByIdAndUpdate(mouvement._id, {
            date_appareillage_prevue: demande.date,
            heure_appareillage_prevue: demande.heure,
            etat: etatOut._id,
        }, {new: true})
    }

    res.status(200).json({
        status: "success",
        message: "La demande a été validée avec succès",
        data: demandeChanged
    })
});

exports.devalidateDemande = AsyncHandler(async (req, res) => {
    const attenteEtat = await Etat.findOne().where('code').equals('EN_ATTENTE');
    await Demande.findByIdAndUpdate(
        req.params.id,
        {
            etat: attenteEtat._id,
        }, {
            new: true,
        })

    res.status(200).json({
        status: "success",
        message: "La demande a été devalidée avec succès",
    })
});


exports.invalidateDemande = AsyncHandler(async (req, res) => {
    const etatReject = await Etat.findOne().where('code').equals('REJETEE');
    const etatValidee = await Etat.findOne().where('code').equals('VALIDEE');
    const demande = await Demande.findById(req.params.id);

    if (demande.incoming) {
        const demandeOutgoing = await Demande.findOne().where('escale').equals(demande.escale).where('incoming').equals(false)
        if (demandeOutgoing.etat !== etatValidee._id) {
            await Demande.findByIdAndUpdate(
                demandeOutgoing._id,
                {
                    etat: etatReject._id,
                    rejection_reason: req.body.rejection_reason
                }, {
                    new: true,
                }
            );
        }


    }
    const demandeChanged = await Demande.findByIdAndUpdate(
        req.params.id,
        {
            etat: etatReject._id,
            rejection_reason: req.body.rejection_reason
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "La demande a été invalidée avec succès",
        data: demandeChanged
    })
});
exports.cancelDemande = AsyncHandler(async (req, res) => {
    const etatAnnulee = await Etat.findOne().where('code').equals('ANNULEE');
    const etatValidee = await Etat.findOne().where('code').equals('VALIDEE');
    const demande = await Demande.findById(req.params.id);
    if (demande.incoming) {
        const demandeOutgoing = await Demande.findOne().where('escale').equals(demande.escale).where('incoming').equals(false)
        if (demandeOutgoing.etat !== etatValidee._id) {
            await Demande.findByIdAndUpdate(
                demandeOutgoing._id,
                {
                    etat: etatAnnulee._id,
                    rejection_reason: req.body.rejection_reason
                }, {
                    new: true,
                }
            );
        }


    }
    const demandeChanged = await Demande.findByIdAndUpdate(
        req.params.id,
        {
            etat: etatAnnulee._id,
            rejection_reason: req.body.rejection_reason
        }, {
            new: true,
        }
    );

    res.status(200).json({
        status: "success",
        message: "La demande a été annulée avec succès",
        data: demandeChanged
    })
});

exports.updateDemande = AsyncHandler(async (req, res) => {

    const demande = Demande.findById(req.params.id)
    const demandeChanged = await Demande.findByIdAndUpdate(
        req.params.id,
        {
            date: req.body.date,
            heure: req.body.heure,
        }, {
            new: true,
        }
    );
    if (demande.incoming) {
        await Escale.findByIdAndUpdate(demande.escale, {
            date_accostage_prevue: req.body.date,
            heure_accostage_prevue: req.body.heure,
        }, {new: true})
    } else {
        await Escale.findByIdAndUpdate(demande.escale, {
            date_appareillage_prevue: req.body.date,
            heure_appareillage_prevue: req.body.heure,
        }, {new: true})
    }

    res.status(200).json({
        status: "success",
        message: "La demande a été modifié avec succès",
        data: demandeChanged
    })
});
