const AsyncHandler = require('express-async-handler');
const TypeMouvement = require('../../model/TypeMouvement');


exports.createTypeMouvement = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const typeMouvement = await TypeMouvement.findOne({code});
    if (typeMouvement) {
        throw new Error("Le type de mouvement existe déjà");
    }

    const typeMouvementCreated = await TypeMouvement.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "Le type de mouvement a été crée avec succès",
        data: typeMouvementCreated
    })
});

exports.getTypeMouvements = AsyncHandler(async (req, res) => {
    const typeMouvements = await TypeMouvement.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des types de mouvements ont été récupéré avec succès",
        data: typeMouvements
    })
});

exports.getTypeMouvement = AsyncHandler(async (req, res) => {
    const typeMouvement = await TypeMouvement.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le type de mouvement a été récupéré avec succès",
        data: typeMouvement
    });
});

exports.updateTypeMouvement = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createTypeMouvementFound = await TypeMouvement.find({code});
    if (createTypeMouvementFound) {
        throw new Error("Le type de mouvement existe déjà.");
    }
    const typeMouvement = await TypeMouvement.findByIdAndUpdate(
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
        message: "Le type de mouvement a été modifié avec succès",
        data: typeMouvement
    })

})

exports.deleteTypeMouvement = AsyncHandler(async (req, res) => {
    await TypeMouvement.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le type de mouvement a été supprimé avec succès",
    })
});
