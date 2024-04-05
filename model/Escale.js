const mongoose = require("mongoose");
const escaleSchema = new mongoose.Schema({
    date_accostage_prevue: {
        type: Date,
    },
    date_appareillage_prevue: {
        type: Date,

    },
    heure_accostage_prevue: {
        type: String,
    },
    heure_appareillage_prevue: {
        type: String,

    },
    date_accostage_estimee: {
        type: Date,
    },
    date_appareillage_estimee: {
        type: Date,
    },
    heure_accostage_estimee: {
        type: String,
    },
    heure_appareillage_estimee: {
        type: String,
    },

    is_commerciale: {
        type: Boolean,
    },

    is_dangerous: {
        type: Boolean,
    },
    numero_voyage: {
        type: String,
    },

    operations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Operation"
        },
    ],
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agence"
    },
    quai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quai"
    },
    acconier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Acconier"
    },
    navire:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Navire"
        },
    etat:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etat"
        },
    zone:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone"
        },
    user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

    dossierEscale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierEscale', // Reference to the Escale model
    },

}, {
    timestamps: true
})

escaleSchema.pre('save', async function(next) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    const lastDoc = await this.constructor.findOne({ numero_voyage: new RegExp(`^VTR${year}${month}${day}`) })
        .sort('numero_voyage')
        .select('numero_voyage')
        .limit(1);

    let lastId = 1;
    if (lastDoc) {
        lastId = parseInt(lastDoc.numero_voyage.substr(11)) + 1;
    }

    const paddedId = ('00000' + lastId).slice(-5);
    this.numero_voyage = `VTR${year}${month}${day}${paddedId}`;

    next();
});

const EscaleSchema = mongoose.model("Escale", escaleSchema);


module.exports = EscaleSchema;
