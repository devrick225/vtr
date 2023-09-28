const AsyncHandler = require('express-async-handler');
const Navire = require('../../model/Navire');

exports.createNavire = AsyncHandler(async (req, res) => {
    const {
        ancien_nom,
        nom,
        code_radio,
        longueur,
        largeur,
        imo,
        mmsi,
        tirant_eau,
        type,
        volume,
        tirant_eau_arriere,
        tirant_eau_avant
    } = req.body;


    const navire = await Navire.findOne({nom});
    if (navire) {
        throw new Error("Le navire existe déjà");
    }

    const navireCreated = await Navire.create({
        ancien_nom,
        nom,
        code_radio,
        longueur,
        largeur,
        imo,
        mmsi,
        tirant_eau,
        type,
        volume,
        tirant_eau_arriere,
        tirant_eau_avant
    })
    res.status(201).json({
        status: "Success",
        message: "Le navire a été crée avec succès",
        data: navireCreated
    })
});

exports.getNavires = AsyncHandler(async (req, res) => {
    const navires = await Navire.find();
    res.status(200).json({
        status: "success",
        message: "La liste des navires ont été récupéré avec succès",
        data: navires
    })
});

exports.getNavire = AsyncHandler(async (req, res) => {
    const navire = await Navire.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le navire a été récupéré avec succès",
        data: navire
    });
});


exports.getNaviresByImoOrMmsi = AsyncHandler(async (req, res) => {
    const { valeur } = req.query;

    if (!valeur) {
        return res.status(400).json({ message: 'Le champ de recherche est requis' });
    }
    // Créer un objet de filtre pour rechercher les navires en fonction du champ
    const filter = {
        $or: [
            { nom: { $regex: valeur, $options: 'i' } }, // Recherche insensible à la casse dans le nom
            { imo: valeur },
            { mmsi: valeur },
        ],
    };


    // Rechercher la liste des navires en fonction du filtre
    const navires = await Navire.find(filter);

    if (!navires) {
        throw new Error(`Le navire n'existe pas`);
    }
    res.status(200).json({
        status: "success",
        message: "Le navire a été modifié avec succès",
        data: navires
    })

})
exports.updateNavire = AsyncHandler(async (req , res) => {
    const { ancien_nom,
        nom,
        code_radio,
        longueur,
        largeur,
        imo,
        mmsi,
        tirant_eau,
        type,
        volume,
        tirant_eau_arriere,
        tirant_eau_avant} = req.body;
    const createNavireFound = await Navire.find({nom});
    if (createNavireFound) {
        throw new Error("Le navire existe déjà.");
    }
    const navire = await Navire.findByIdAndUpdate(
        req.params.id,
        {
            ancien_nom,
            nom,
            code_radio,
            longueur,
            largeur,
            imo,
            mmsi,
            tirant_eau,
            type,
            volume,
            tirant_eau_arriere,
            tirant_eau_avant
        }, {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "Le navire a été modifié avec succès",
        data: navire
    })

})

exports.deleteNavire = AsyncHandler(async (req, res) => {
    await Navire.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Le navire a été supprimé avec succès",
    })
});
