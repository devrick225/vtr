const AsyncHandler = require('express-async-handler');
const Privilege = require('../../model/Privilege');


exports.createPrivilege = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;

    const privilege = await Privilege.findOne({code});
    if (privilege) {
        throw new Error("Le privilège existe déjà");
    }

    const privilegeCreated = await Privilege.create({
        libelle,
        code,
    })
    res.status(201).json({
        status: "Success",
        message: "Le privilège a été crée avec succès",
        data: privilegeCreated
    })
});

exports.getPrivileges = AsyncHandler(async (req, res) => {
    const privileges = await Privilege.find().sort({libelle: 1});
    res.status(200).json({
        status: "success",
        message: "La liste des privilèges ont été récupéré avec succès",
        data: privileges
    })
});

exports.getPrivilege = AsyncHandler(async (req, res) => {
    const privilege = await Privilege.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le privilège a été récupéré avec succès",
        data: privilege
    });
});

exports.updatePrivilege = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createPrivilegeFound = await Privilege.find({code});
    if (createPrivilegeFound) {
        throw new Error("Le privilège existe déjà.");
    }
    const privilege = await Privilege.findByIdAndUpdate(
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
        message: "Le privilège a été modifié avec succès",
        data: privilege
    })

})

exports.deletePrivilege = AsyncHandler(async (req, res) => {
    await Privilege.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le privilège a été supprimé avec succès",
    })
});
