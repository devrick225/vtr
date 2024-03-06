const AsyncHandler = require('express-async-handler');
const ServiceAssistance = require('../../model/ServiceAssistance');


exports.createServiceAssistance = AsyncHandler(async (req, res) => {
    const {libelle, code, auto_generated} = req.body;

    const serviceAssistance = await ServiceAssistance.findOne({code});
    if (serviceAssistance) {
        throw new Error("Le service d'assistance existe déjà");
    }

    const serviceAssistanceCreated = await ServiceAssistance.create({
        libelle,
        code,
        auto_generated
    })
    res.status(201).json({
        status: "Success",
        message: "Le service d'assistance a été crée avec succès",
        data: serviceAssistanceCreated
    })
});

exports.getServiceAssistances = AsyncHandler(async (req, res) => {
    const servicesAssistances = await ServiceAssistance.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des services d'assistances ont été récupéré avec succès",
        data: servicesAssistances
    })
});

exports.getServiceAssistance = AsyncHandler(async (req, res) => {
    const serviceAssistance = await ServiceAssistance.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le service d'assistance a été récupéré avec succès",
        data: serviceAssistance
    });
});

exports.updateServiceAssistance = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createServiceAssistanceFound = await ServiceAssistance.find({code});
    if (createServiceAssistanceFound) {
        throw new Error("Le service d'assistance existe déjà.");
    }
    const serviceAssistance = await ServiceAssistance.findByIdAndUpdate(
        req.params.id,
        {
            libelle,
            code,
            auto_generated
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "Le service d'assistance a été modifié avec succès",
        data: serviceAssistance
    })

})

exports.deleteServiceAssistance = AsyncHandler(async (req, res) => {
    await ServiceAssistance.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le service d'assistance a été supprimé avec succès",
    })
});
