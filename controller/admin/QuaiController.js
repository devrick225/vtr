const AsyncHandler = require('express-async-handler');
const Quai = require('../../model/Quai');


exports.createQuai = AsyncHandler(async (req, res) => {
    const {code, description, longitude, latitude} = req.body;

    const quai = await Quai.findOne({code});
    if (quai) {
        throw new Error("Le quai existe déjà");
    }

    const quaiCreated = await Quai.create({
        code, description, longitude, latitude
    })
    res.status(201).json({
        status: "Success",
        message: "Le quai a été crée avec succès",
        data: quaiCreated
    })
});

exports.getQuais = AsyncHandler(async (req, res) => {
    const quais = await Quai.find();
    res.status(200).json({
        status: "success",
        message: "La liste des quais ont été récupéré avec succès",
        data: quais
    })
});

exports.getQuai = AsyncHandler(async (req, res) => {
    const quai = await Quai.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le quai a été récupéré avec succès",
        data: quai
    });
});

exports.updateQuai = AsyncHandler(async (req, res) => {
    const {code, description, longitude, latitude} = req.body;
    const createQuaiFound = await Quai.find({code});
    if (createQuaiFound) {
        throw new Error("Le quai existe déjà.");
    }
    const quai = await Quai.findByIdAndUpdate(
        req.params.id,
        {
            code, description, longitude, latitude
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "Le quai a été modifié avec succès",
        data: quai
    })

})

exports.deleteQuai = AsyncHandler(async (req, res) => {
    await Quai.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "L'état a été supprimé avec succès",
    })
});
