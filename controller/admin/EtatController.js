const AsyncHandler = require('express-async-handler');
const Etat = require('../../model/Etat');


exports.createEtat = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const etat = await Etat.findOne({code});
    if (etat) {
        throw new Error("L'état existe déjà");
    }

    const etatCreated = await Etat.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "L'état a été crée avec succès",
        data: etatCreated
    })
});

exports.getEtats = AsyncHandler(async (req, res) => {
    const etats = await Etat.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des états ont été récupéré avec succès",
        data: etats
    })
});

exports.getEtat = AsyncHandler(async (req, res) => {
    const etat = await Etat.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été récupéré avec succès",
        data: etat
    });
});

exports.updateEtat = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createEtatFound = await Etat.find({code});
    if (createEtatFound) {
        throw new Error("L'état existe déjà.");
    }
    const etat = await Etat.findByIdAndUpdate(
        req.params.id,
        {
            libelle,
            code,
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "L'état a été modifié avec succès",
        data: etat
    })

})

exports.deleteEtat = AsyncHandler(async (req, res) => {
    await Etat.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été supprimé avec succès",
    })
});
