const User = require('../model/User');
const Access = require('../model/Access');

const verifyToken = require('../utils/verifyToken');

const isAuthenticated = async (req, res, next) => {
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1];
    const verifiedToken = verifyToken(token);
    if(verifiedToken) {
        req.userAuth = await User.findById(verifiedToken.id).populate("userGroup").populate('agence');
        req.userAccess = await Access.find().where('userGroup').equals(req.userAuth.userGroup._id).populate('privilege')
        next();
    }else {
        const err = new Error("Token expired/invalid");
        next(err);
    }
}

module.exports = isAuthenticated
