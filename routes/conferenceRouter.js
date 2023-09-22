const express = require('express')

const {startConference, todayConference, closeConference
} = require("../controller/ConferenceController")
const isAuthenticated = require("../middlewares/isAuthenticated");


const conferenceRouter = express.Router();

conferenceRouter.post('/start', isAuthenticated, startConference);
conferenceRouter.post('/:id/close', isAuthenticated, closeConference);
conferenceRouter.get('/today', isAuthenticated, todayConference);


module.exports = conferenceRouter
