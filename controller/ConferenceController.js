const AsyncHandler = require('express-async-handler');
const Zone = require('../model/Zone');
const Etat = require('../model/Etat');
const Navire = require('../model/Navire');
const Escale = require('../model/Escale');
const Quai = require('../model/Quai');
const Prestation = require('../model/Prestation');
const Conference = require('../model/Conference');
const Demande = require("../model/Demande");
const axios = require("axios");


exports.startConference = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const conferenceCreated = await Conference.create({
        heure_debut: new Date().toLocaleTimeString(['FR'], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        user_run: userAuth._id,
    })
    res.status(201).json({
        status: "Success",
        message: "La conférence a été crée avec succès",
        data: conferenceCreated
    })
});

exports.todayConference = AsyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const query = {createdAt: {$gte: today, $lt: tomorrow}};
    const conferences = await Conference.find(query)
    if (conferences.length > 0) {
        res.status(200).json({
            status: "Success",
            message: "La conférence a été crée avec succès",
            data: conferences
        })
    } else {
        res.status(200).json({
            status: "Success",
            message: "La conférence a été crée avec succès",
            data: conferences
        })
    }
})

exports.closeConference = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const conferenceUpdated = await Conference.findByIdAndUpdate(req.params.id, {
        heure_fin: new Date().toLocaleTimeString(['FR'], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        user_off: userAuth._id,
        closed: true,
        close_at: new Date()
    }, {
        new: true,
    })

    res.status(200).json({
        status: "success",
        message: "La conférence a été clôturée avec succès",
        data: conferenceUpdated
    })
})
