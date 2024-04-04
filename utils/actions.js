const historiqueDesActions = require("../middlewares/historiqueDesActions");

let actions = {
    authentification: 'connexion',
    deconnexion: 'deconnexion',
    creerEscale: 'creer_escale',
    creerDemande: 'creer_demande',
    modifierMotDePasse: 'modifier_motdepasse',
    modifierUtilisateur: 'modifier_utilisateur',
    modifierDemande: 'modifier_demande',
    validerDemande: 'valider_demande',
    devaliderDemande: 'devalider_demande',
    rejeterDemande: 'rejeter_demande',
    annulerDemande: 'annuler_demande',
    modifierSignature: 'modifier_signature'
}
module.exports = actions;
