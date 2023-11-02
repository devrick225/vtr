const mongoose = require('mongoose');

const dossierEscaleSchema = new mongoose.Schema({
    escale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Escale', // Reference to the Escale model
    },
    date_accostage_estimee: String,
    heure_accostage_estimee: String,
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agence', // Reference to the Escale model
    },
    pol: String,
    atp: String,
    numero_escale: String,
    date_appareillage_estimee: String,
    heure_appareillage_estimee: String,
    pod: String,
    tel: String,
    etat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Etat', // Reference to the Etat model (assuming you have an Etat model)
    },
    date_arrivee_rade: String,
    heure_arrivee_rade: String,
    date_arrivee_mouillage: String,
    heure_arrivee_mouillage: String,
    motif_attente: String,
    sejour_rade: String,
    date_accostage: String,
    heure_accostage: String,
    entree_tirant_eau_arr: String,
    entree_tirant_eau_av: String,
    date_accostage_prevue: String,
    heure_accostage_prevue: String,
    cause_retard: String,
    sejour_prevu: String,
    date_depart_rade: String,
    heure_depart_rade: String,
    date_depart_mouillage: String,
    heure_depart_mouillage: String,
    date_appareillage: String,
    heure_appareillage: String,
    sortie_tirant_eau_arr: String,
    sortie_tirant_eau_av: String,
    date_appareillage_prevue: String,
    heure_appareillage_prevue: String,
    sejour_effectif: String,
    sejour_duree: String,
});

const DossierEscale = mongoose.model('DossierEscale', dossierEscaleSchema);

module.exports = DossierEscale;
