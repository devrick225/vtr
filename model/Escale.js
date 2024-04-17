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

escaleSchema.pre('save', async function (next) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format de date YYYYMMDD

    // Recherche du nombre total d'escales créées jusqu'à la date actuelle
    const count = await this.constructor.countDocuments({
        createdAt: {
            $lte: currentDate // Utilisez $lte pour rechercher les escales créées jusqu'à la date actuelle
        }
    });

    console.log('count', count)

    // Incrément de la séquence
    const sequence = count + 1;

    // Génération du numéro de voyage au format "VTR(datedujour)-sequence"
    const numeroVoyage = `VTR${formattedDate}-${sequence}`;

    // Attribution du numéro de voyage à l'escale
    this.numero_voyage = numeroVoyage;

    next();
});
const EscaleSchema = mongoose.model("Escale", escaleSchema);


module.exports = EscaleSchema;
