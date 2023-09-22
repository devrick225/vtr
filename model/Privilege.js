const mongoose = require("mongoose");
const privilegeSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,

    },
    userGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserGroup"
        }
    ]
}, {
    timestamps: true
})

const PrivilegeSchema = mongoose.model("Privilege", privilegeSchema);

module.exports = PrivilegeSchema;
