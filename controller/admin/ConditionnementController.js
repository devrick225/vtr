const AsyncHandler = require('express-async-handler');
const Conditionnement = require('../../model/Conditionnement');


exports.createConditionnement = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const conditionnement = await Conditionnement.findOne({code});
    if (conditionnement) {
        throw new Error("L'état existe déjà");
    }

    const conditionnementCreated = await Conditionnement.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "L'état a été crée avec succès",
        data: conditionnementCreated
    })
});

exports.getConditionnements = AsyncHandler(async (req, res) => {
    const conditionnements = await Conditionnement.find();
    res.status(200).json({
        status: "success",
        message: "La liste des états ont été récupéré avec succès",
        data: conditionnements
    })
});

exports.getConditionnement = AsyncHandler(async (req, res) => {
    const conditionnement = await Conditionnement.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été récupéré avec succès",
        data: conditionnement
    });
});

exports.updateConditionnement = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createConditionnementFound = await Conditionnement.find({code});
    if (createConditionnementFound) {
        throw new Error("L'état existe déjà.");
    }
    const conditionnement = await Conditionnement.findByIdAndUpdate(
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
        data: conditionnement
    })

})

exports.deleteConditionnement = AsyncHandler(async (req, res) => {
    await Conditionnement.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été supprimé avec succès",
    })
});
