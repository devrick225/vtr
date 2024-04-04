const AsyncHandler = require('express-async-handler');
const Marchandise = require('../../model/Marchandise');


exports.createMarchandise = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const marchandise = await Marchandise.findOne({code});
    if (marchandise) {
        throw new Error("La marchandise existe déjà");
    }

    const marchandiseCreated = await Marchandise.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "La marchandise a été crée avec succès",
        data: marchandiseCreated
    })
});

exports.getMarchandises = AsyncHandler(async (req, res) => {
    const marchandises = await Marchandise.find().sort({libelle: 1});

    res.status(200).json({
        status: "success",
        message: "La liste des marchandises ont été récupéré avec succès",
        data: marchandises
    })
});

exports.getMarchandise = AsyncHandler(async (req, res) => {
    const marchandise = await Marchandise.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "La marchandise a été récupéré avec succès",
        data: marchandise
    });
});

exports.updateMarchandise = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createMarchandiseFound = await Marchandise.find({code});
    if (createMarchandiseFound) {
        throw new Error("La marchandise existe déjà.");
    }
    const marchandise = await Marchandise.findByIdAndUpdate(
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
        message: "La marchandise a été modifié avec succès",
        data: marchandise
    })

})

exports.deleteMarchandise = AsyncHandler(async (req, res) => {
    await Marchandise.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "La marchandise a été supprimé avec succès",
    })
});
