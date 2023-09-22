const AsyncHandler = require('express-async-handler');
const Prestataire = require('../../model/Prestataire');


exports.createPrestataire = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const prestataire = await Prestataire.findOne({code});
    if (prestataire) {
        throw new Error("Le prestataire existe déjà");
    }

    const prestataireCreated = await Prestataire.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "Le prestataire a été crée avec succès",
        data: prestataireCreated
    })
});

exports.getPrestataires = AsyncHandler(async (req, res) => {
    const prestataires = await Prestataire.find();
    res.status(200).json({
        status: "success",
        message: "La liste des prestataires ont été récupéré avec succès",
        data: prestataires
    })
});

exports.getPrestataire = AsyncHandler(async (req, res) => {
    const prestataire = await Prestataire.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le prestataire a été récupéré avec succès",
        data: prestataire
    });
});

exports.updatePrestataire = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createPrestataireFound = await Prestataire.find({code});
    if (createPrestataireFound) {
        throw new Error("Le prestataire existe déjà.");
    }
    const prestataire = await Prestataire.findByIdAndUpdate(
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
        message: "Le prestataire a été modifié avec succès",
        data: prestataire
    })

})

exports.deletePrestataire = AsyncHandler(async (req, res) => {
    await Prestataire.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le prestataire a été supprimé avec succès",
    })
});
