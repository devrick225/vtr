const mongoose = require("mongoose");
const userGroupSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,

    },
    description: {
        type: String,

    },
    privileges: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Privilege"
        }
    ]
}, {
    timestamps: true
})

const UserGroupSchema = mongoose.model("UserGroup", userGroupSchema);

module.exports = UserGroupSchema;
