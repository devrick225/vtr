const AsyncHandler = require('express-async-handler');
const Demande = require('../model/Demande');
const Etat = require("../model/Etat");
const Escale = require("../model/Escale");



exports.createDemande= AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const etatEnAttente = await Etat.findOne().where('code').equals('EN_ATTENTE');

    if(userAuth.userGroup.code !== 'CONSIGNATAIRE' ) {
        throw new Error('Seul les consignataires peuvent éffectuer une demande')
    }
    const demandes = await Demande.find().where('escale').equals(req.body.escale).where('user').equals(req.userAuth._id);


    const {
        incoming,
        escale,
        date,
        heure,
    } = req.body;

    const demandeCreated = await Demande.create({
        incoming,
        escale,
        etat: etatEnAttente._id,
        date,
        heure,
    })
    res.status(201).json({
        status: "Success",
        message: "La demande a été crée avec succès",
        data: demandeCreated
    })
});



exports.getDemandes= AsyncHandler(async (req, res) => {
    const demandes = await Demande.find().sort('-createdAt')
        .populate({ path: 'escale',
            populate: [
                { path: 'user', model: 'User', populate: [
                        { path: 'agence', model: 'Agence' },
                    ], },
                { path: 'navire', model: 'Navire' },
                { path: 'quai', model: 'Quai' },
                { path: 'acconier', model: 'Acconier' },
            ],})

        .populate('etat').populate('user');
    res.status(200).json({
        status: "Success",
        message: "La liste des demandes a été récupérée avec succès",
        data: demandes
    })

});


exports.validateDemande= AsyncHandler(async (req, res) => {
    const etatValidate = await Etat.findOne().where('code').equals('VALIDEE');
    const demandeChanged = await Demande.findByIdAndUpdate(
        req.params.id,
        {
            etat: etatValidate._id
        }, {
            new: true,
        }
    );
    console.log(demandeChanged)
    res.status(200).json({
        status: "success",
        message: "La demande a été validée avec succès",
        data: demandeChanged
    })
});


exports.invalidateDemande= AsyncHandler(async (req, res) => {
    const etatReject = await Etat.findOne().where('code').equals('REJETEE');
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
exports.cancelDemande= AsyncHandler(async (req, res) => {
    const etatAnnulee = await Etat.findOne().where('code').equals('ANNULEE');
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

exports.updateDemande= AsyncHandler(async (req, res) => {
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
    if(demande.incoming) {
        await Escale.findByIdAndUpdate(demande.escale, {
            date_accostage_prevue: req.body.date,
            heure_accostage_prevue: req.body.heure,
        }, {new: true})
    }else {
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
