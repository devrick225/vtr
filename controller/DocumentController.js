const TypeDocument = require("../model/TypeDocument");
const Document = require("../model/Document");
const AsyncHandler = require('express-async-handler');
const fs = require('fs');
const Etat = require("../model/Etat");



exports.uploadDoc = AsyncHandler(async (req, res) => {
    const enAttenteEtat = await Etat.findOne().where('code').equals('EN_ATTENTE');
    const document = await Document.findById(req.params.id).populate('typeDocument').populate('escale')


    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    // Access the file content from req.file.buffer
    const fileContent = req.file.buffer;

    // Define the directory where you want to save the file
    const uploadDir = 'uploads/escales';

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    // Generate a unique filename or use the original filename
    const fileName = `${document.escale._id}_${document.typeDocument.code}.pdf`;

    // Define the full path to save the file
    const filePath = `${uploadDir}/${fileName}`;

    // Write the file content to the specified path
    fs.writeFile(filePath, fileContent, async (err) => {
        if (err) {
            console.error('Error saving the file:', err);
            return res.status(500).json({ error: 'File upload failed.' });
        }

        const updateDoc = await Document.findByIdAndUpdate(req.params.id, {
            etat: enAttenteEtat._id,
            deposer_par: req.userAuth._id,
            motif: '',
            file_name: fileName,
            full_path: filePath
        }, {
            new: true,
        });

        return res.status(200).json({
            status: "Success",
            message: "Document uploaded successfully",
            data: updateDoc
        });
    });
});
exports.validateDoc = AsyncHandler(async (req, res) => {
    const valideeEtat = await Etat.findOne().where('code').equals('VALIDEE');
    await Document.findByIdAndUpdate(
        req.params.id,
        {
            etat: valideeEtat._id,
            valider_par: req.userAuth._id
        }, {
            new: true,
        })

    res.status(200).json({
        status: "success",
        message: "Le document a été validé avec succès",
    })
});

exports.devalidateDoc = AsyncHandler(async (req, res) => {
    const rejetEtat = await Etat.findOne().where('code').equals('REJETEE');
    await Document.findByIdAndUpdate(
        req.params.id,
        {
            motif: req.body.motif,
            etat: rejetEtat._id,
            rejeter_par: req.userAuth._id
        }, {
            new: true,
        })

    res.status(200).json({
        status: "success",
        message: "Le document a été rejeté avec succès",
    })
});
