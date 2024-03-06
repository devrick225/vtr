const AsyncHandler = require('express-async-handler');
const TypeOperation = require('../../model/TypeOperation');


exports.createTypeOperation = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const typeOperation = await TypeOperation.findOne({code});
    if (typeOperation) {
        throw new Error("L'état existe déjà");
    }

    const typeOperationCreated = await TypeOperation.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "L'état a été crée avec succès",
        data: typeOperationCreated
    })
});

exports.getTypeOperations = AsyncHandler(async (req, res) => {
    const typeOperations = await TypeOperation.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des états ont été récupéré avec succès",
        data: typeOperations
    })
});

exports.getTypeOperation = AsyncHandler(async (req, res) => {
    const typeOperation = await TypeOperation.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été récupéré avec succès",
        data: typeOperation
    });
});

exports.updateTypeOperation = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createTypeOperationFound = await TypeOperation.find({code});
    if (createTypeOperationFound) {
        throw new Error("L'état existe déjà.");
    }
    const typeOperation = await TypeOperation.findByIdAndUpdate(
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
        data: typeOperation
    })

})

exports.deleteTypeOperation = AsyncHandler(async (req, res) => {
    await TypeOperation.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été supprimé avec succès",
    })
});
