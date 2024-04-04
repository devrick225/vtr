const AsyncHandler = require('express-async-handler');
const Acconier = require('../../model/Acconier');


exports.createAcconier = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const acconier = await Acconier.findOne({code});
    if (acconier) {
        throw new Error("L'acconier existe déjà");
    }

    const acconierCreated = await Acconier.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "L'acconier a été crée avec succès",
        data: acconierCreated
    })
});

exports.getAcconiers = AsyncHandler(async (req, res) => {
    const acconiers = await Acconier.find().sort({libelle: 1});

    res.status(200).json({
        status: "success",
        message: "La liste des acconiers ont été récupéré avec succès",
        data: acconiers
    })
});

exports.getAcconier = AsyncHandler(async (req, res) => {
    const acconier = await Acconier.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'acconier a été récupéré avec succès",
        data: acconier
    });
});

exports.updateAcconier = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createAcconierFound = await Acconier.find({code});
    if (createAcconierFound) {
        throw new Error("L'acconier existe déjà.");
    }
    const acconier = await Acconier.findByIdAndUpdate(
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
        message: "L'acconier a été modifié avec succès",
        data: acconier
    })

})

exports.deleteAcconier = AsyncHandler(async (req, res) => {
    await Acconier.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'acconier a été supprimé avec succès",
    })
});
