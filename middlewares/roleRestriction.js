const roleRestriction = async (req, res, next) => {
    console.log(req.userAuth)
    next();
}

module.exports = roleRestriction;
