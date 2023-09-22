const mongoose = require("mongoose");
const accessSchema = new mongoose.Schema({
    can_read: {
        type: Boolean,
        required: true,
        default: true
    },
    can_create: {
        type: Boolean,
        required: true,
        default: true

    },
    can_update: {
        type: Boolean,
        required: true,
        default: true

    },
    can_delete: {
        type: Boolean,
        required: true,
        default: true
    },
    userGroup:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserGroup"
        },
    privilege:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Privilege"
        },

}, {
    timestamps: true
})

const AccessSchema = mongoose.model("Access", accessSchema);

module.exports = AccessSchema;
