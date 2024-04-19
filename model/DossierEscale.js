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

dossierEscaleSchema.pre('save', function(next) {
    if (this.date_arrivee_rade && this.date_depart_rade && this.heure_arrivee_rade && this.heure_depart_rade) {
        // Calcul de la durée du séjour au rade
        const dateArriveeRade = new Date(`${this.date_arrivee_rade}T${this.heure_arrivee_rade}`);
        const dateDepartRade = new Date(`${this.date_depart_rade}T${this.heure_depart_rade}`);
        const diffTime = Math.abs(dateDepartRade - dateArriveeRade);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        // Mise à jour de sejour_rade
        this.sejour_rade = diffHours.toString();
    }

    if (this.date_accostage_prevue && this.date_appareillage_prevue && this.heure_accostage_prevue && this.heure_appareillage_prevue) {
        // Calcul de la durée du séjour prévu
        const dateAccostage = new Date(`${this.date_accostage_prevue}T${this.heure_accostage_prevue}`);
        const dateAppareillage = new Date(`${this.date_appareillage_prevue}T${this.heure_appareillage_prevue}`);
        const diffTime = Math.abs(dateAppareillage - dateAccostage);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        // Mise à jour de sejour_prevu
        this.sejour_prevu = diffHours.toString();
    }
    if (this.date_accostage && this.date_appareillage && this.heure_accostage && this.heure_appareillage) {
        // Calcul de la durée du séjour effectif
        const dateAccostage = new Date(`${this.date_accostage}T${this.heure_accostage}`);
        const dateAppareillage = new Date(`${this.date_appareillage}T${this.heure_appareillage}`);
        const diffTime = Math.abs(dateAppareillage - dateAccostage);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        // Mise à jour de sejour_effectif
        this.sejour_effectif = diffHours.toString();

        // Mise à jour de sejour_duree
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.sejour_duree = diffDays.toString();
    }
    next();
});

const DossierEscale = mongoose.model('DossierEscale', dossierEscaleSchema);

module.exports = DossierEscale;
