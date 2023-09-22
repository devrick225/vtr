const AsyncHandler = require('express-async-handler');
const Agence = require('../../model/Agence');


exports.createAgence = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const agence = await Agence.findOne({code});
    if (agence) {
        throw new Error("L'état existe déjà");
    }

    const agenceCreated = await Agence.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "L'état a été crée avec succès",
        data: agenceCreated
    })
});

exports.getAgences = AsyncHandler(async (req, res) => {
    const agences = await Agence.find();
    res.status(200).json({
        status: "success",
        message: "La liste des états ont été récupéré avec succès",
        data: agences
    })
});

exports.getAgence = AsyncHandler(async (req, res) => {
    const agence = await Agence.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été récupéré avec succès",
        data: agence
    });
});

exports.updateAgence = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createAgenceFound = await Agence.find({code});
    if (createAgenceFound) {
        throw new Error("L'état existe déjà.");
    }
    const agence = await Agence.findByIdAndUpdate(
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
        data: agence
    })

})

exports.deleteAgence = AsyncHandler(async (req, res) => {
    await Agence.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été supprimé avec succès",
    })
});
