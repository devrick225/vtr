const AsyncHandler = require('express-async-handler');
const TypeDocument = require('../../model/TypeDocument');


exports.createTypeDocument = AsyncHandler(async (req, res) => {
    const {libelle, code, required} = req.body;

    const typeDocument = await TypeDocument.findOne({code});
    if (typeDocument) {
        throw new Error("Le type de document existe déjà");
    }

    const typeDocumentCreated = await TypeDocument.create({
        libelle,
        code,
        required
    })
    res.status(201).json({
        status: "Success",
        message: "Le type de document a été crée avec succès",
        data: typeDocumentCreated
    })
});

exports.getTypeDocuments = AsyncHandler(async (req, res) => {
    const typeDocuments = await TypeDocument.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des types de documents ont été récupéré avec succès",
        data: typeDocuments
    })
});

exports.getTypeDocument = AsyncHandler(async (req, res) => {
    const typeDocument = await TypeDocument.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le type de document a été récupéré avec succès",
        data: typeDocument
    });
});

exports.updateTypeDocument = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createTypeDocumentFound = await TypeDocument.find({code});
    if (createTypeDocumentFound) {
        throw new Error("Le type de document existe déjà.");
    }
    const typeDocument = await TypeDocument.findByIdAndUpdate(
        req.params.id,
        {
            libelle,
            code,
            required
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "Le type de document a été modifié avec succès",
        data: typeDocument
    })

})

exports.deleteTypeDocument = AsyncHandler(async (req, res) => {
    await TypeDocument.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le type de document a été supprimé avec succès",
    })
});
