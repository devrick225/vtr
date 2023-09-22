const bcrypt = require('bcryptjs');


exports.hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
exports.isPasswordMatched = async (password, hash) => {
    return bcrypt.compare(password, hash);
}
