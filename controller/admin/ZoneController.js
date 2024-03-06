const AsyncHandler = require('express-async-handler');
const Zone = require('../../model/Zone');


exports.createZone = AsyncHandler(async (req, res) => {
    const {libelle, code, rank} = req.body;

    const zone = await Zone.findOne({code});
    if (zone) {
        throw new Error("La zone existe déjà");
    }

    const zoneCreated = await Zone.create({
        libelle,
        code,
        rank
    })
    res.status(201).json({
        status: "Success",
        message: "La zone a été crée avec succès",
        data: zoneCreated
    })
});

exports.getZones = AsyncHandler(async (req, res) => {
    const zones = await Zone.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des zones ont été récupéré avec succès",
        data: zones
    })
});

exports.getZone = AsyncHandler(async (req, res) => {
    const zone = await Zone.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "La zone a été récupéré avec succès",
        data: zone
    });
});

exports.updateZone = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createZoneFound = await Zone.find({code});
    if (createZoneFound) {
        throw new Error("La zone existe déjà.");
    }
    const zone = await Zone.findByIdAndUpdate(
        req.params.id,
        {
            libelle,
            code,
            rank
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "La zone a été modifié avec succès",
        data: zone
    })

})

exports.deleteZone = AsyncHandler(async (req, res) => {
    await Zone.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "La zone a été supprimé avec succès",
    })
});
