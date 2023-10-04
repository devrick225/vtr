const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,

    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
    contact: {
        type: String,
    },
    userGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserGroup"
    },
    fonction: {
        type: String,
        enum: ['Pilote', 'Remorqueur', 'Lamaneur', 'Capitaine', 'Consignataire', 'Agent', 'Administrateur', 'Commandant'],
    },
    code_pgop: {
        type: String,
    },
    signature: {
        type: Buffer,
    },
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agence"
    }

}, {
    timestamps: true
})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
    },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
