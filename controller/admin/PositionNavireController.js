const AsyncHandler = require('express-async-handler');
const PositionNavire = require('../../model/PositionNavire');


exports.createPositionNavire = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const positionNavire = await PositionNavire.findOne({code});
    if (positionNavire) {
        throw new Error("La position du navire existe déjà");
    }

    const positionNavireCreated = await PositionNavire.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "La position du navire a été crée avec succès",
        data: positionNavireCreated
    })
});

exports.getPositionNavires = AsyncHandler(async (req, res) => {
    const servicesAssistances = await PositionNavire.find();
    res.status(200).json({
        status: "success",
        message: "La liste des positions d'un navire ont été récupéré avec succès",
        data: servicesAssistances
    })
});

exports.getPositionNavire = AsyncHandler(async (req, res) => {
    const positionNavire = await PositionNavire.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "La position du navire a été récupéré avec succès",
        data: positionNavire
    });
});

exports.updatePositionNavire = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createPositionNavireFound = await PositionNavire.find({code});
    if (createPositionNavireFound) {
        throw new Error("La position du navire existe déjà.");
    }
    const positionNavire = await PositionNavire.findByIdAndUpdate(
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
        message: "La position du navire a été modifié avec succès",
        data: positionNavire
    })

})

exports.deletePositionNavire = AsyncHandler(async (req, res) => {
    await PositionNavire.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "La position du navire a été supprimé avec succès",
    })
});
