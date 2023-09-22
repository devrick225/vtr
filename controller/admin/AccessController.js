const AsyncHandler = require('express-async-handler');
const Access = require('../../model/Access');
const Privilege = require('../../model/Privilege');
const UserGroup = require('../../model/UserGroup');


exports.createAccess = AsyncHandler(async (req, res) => {
    const {privilege, userGroup, can_read, can_delete, can_create, can_update} = req.body;

    const access = await Access.findOne({privilege, userGroup});
    if (access) {
        throw new Error("L'accès existe déjà");
    }
    const existPrivilege = await Privilege.findById(privilege)
    const existUserGroup = await UserGroup.findById(userGroup)
    if(!existPrivilege) {
        throw new Error("Le privilège n'existe pas");

    }if(!existUserGroup) {
        throw new Error("Le groupe d'utilisateur n'existe pas");
    }

    await Privilege.findByIdAndUpdate(
        privilege,
        { $push: { userGroups: userGroup } },
        { new: true, useFindAndModify: false }
    );
    await UserGroup.findByIdAndUpdate(
        userGroup,
        { $push: { privileges: privilege } },
        { new: true, useFindAndModify: false }
    );

    const accessCreated = await Access.create({
        privilege, userGroup, can_read, can_delete, can_create, can_update
    });

    res.status(201).json({
        status: "Success",
        message: "L'accès a été crée avec succès",
        data: accessCreated
    })
});

exports.getAccesss = AsyncHandler(async (req, res) => {
    const accesss = await Access.find();
    res.status(200).json({
        status: "success",
        message: "La liste des accès ont été récupéré avec succès",
        data: accesss
    })
});

exports.getAccess = AsyncHandler(async (req, res) => {
    const access = await Access.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'accès a été récupéré avec succès",
        data: access
    });
});

exports.updateAccess = AsyncHandler(async (req, res) => {
    const {libelle, code} = req.body;
    const createAccessFound = await Access.find({code});
    if (createAccessFound) {
        throw new Error("L'accès existe déjà.");
    }
    const access = await Access.findByIdAndUpdate(
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
        message: "L'accès a été modifié avec succès",
        data: access
    })

})

exports.deleteAccess = AsyncHandler(async (req, res) => {
    await Access.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'accès a été supprimé avec succès",
    })
});
