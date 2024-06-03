const express = require('express')

const {startConference, todayConference, closeConference, demarrerConference, rejoindreConference,terminerConference, dayConference
} = require("../controller/ConferenceController")
const isAuthenticated = require("../middlewares/isAuthenticated");


const conferenceRouter = express.Router();

conferenceRouter.post('/start', isAuthenticated, startConference);
conferenceRouter.post('/:id/close', isAuthenticated, closeConference);
conferenceRouter.get('/today', isAuthenticated, todayConference);
conferenceRouter.get('/by-date', isAuthenticated, dayConference);
conferenceRouter.post('/demarrer', isAuthenticated, demarrerConference);
conferenceRouter.post('/:id/rejoindre', isAuthenticated, rejoindreConference);
conferenceRouter.post('/:id/terminer', isAuthenticated, terminerConference);
module.exports = conferenceRouter
