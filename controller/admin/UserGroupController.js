const AsyncHandler = require('express-async-handler');
const UserGroup = require('../../model/UserGroup');


exports.createUserGroup = AsyncHandler(async (req, res) => {
    const {libelle, code, description} = req.body;

    const userGroup = await UserGroup.findOne({code});
    if (userGroup) {
        throw new Error("Le groupe d'utilisateur existe déjà");
    }

    const userGroupCreated = await UserGroup.create({
        libelle,
        code,
        description
    })
    res.status(201).json({
        status: "Success",
        message: "Le groupe d'utilisateur a été crée avec succès",
        data: userGroupCreated
    })
});

exports.getUserGroups = AsyncHandler(async (req, res) => {
    const userGroups = await UserGroup.find();
    res.status(200).json({
        status: "success",
        message: "La liste des groupes d'utilisateurs ont été récupéré avec succès",
        data: userGroups
    })
});

exports.getUserGroup = AsyncHandler(async (req, res) => {
    const userGroup = await UserGroup.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le groupe d'utilisateur a été récupéré avec succès",
        data: userGroup
    });
});

exports.updateUserGroup = AsyncHandler(async (req, res) => {
    const {libelle, code, description} = req.body;
    const createUserGroupFound = await UserGroup.find({code});
    if (createUserGroupFound) {
        throw new Error("Le groupe d'utilisateur existe déjà.");
    }
    const userGroup = await UserGroup.findByIdAndUpdate(
        req.params.id,
        {
            libelle,
            code,
            description
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "Le groupe d'utilisateur a été modifié avec succès",
        data: userGroup
    })

})

exports.deleteUserGroup = AsyncHandler(async (req, res) => {
    await UserGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le groupe d'utilisateur a été supprimé avec succès",
    })
});
