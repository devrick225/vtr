const jwt = require('jsonwebtoken');

const generateToken = id => {
    return jwt.sign({id}, "WSuGMLqyIavekEq",{expiresIn: "7d"});
};

module.exports = generateToken;
