const AsyncHandler = require('express-async-handler');
const HistoriqueAction = require("../model/HistoriqueAction");


const historiqueDesActions = action => {
    return async (req, res, next) => {
        if(req.userAuth)  {
            await new HistoriqueAction({user: req.userAuth._id, type: action}).save();
        }
        next();
    }
}

module.exports = historiqueDesActions;
