const xlsx = require('xlsx');
const _ = require('lodash');

// Chemin vers votre fichier Excel
const filePath = '/Users/jp.abli/Downloads/Rapprochement comptes/releve compte GL_releve_compte_gl (DAB GIM FAP Août 2024) - ORIGINE.xlsx';

// Charger le fichier Excel
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // Nom de la première feuille
const sheet = workbook.Sheets[sheetName];

// Convertir la feuille en JSON
const data = xlsx.utils.sheet_to_json(sheet);

// Étape 1: Vérifier les occurrences des RRN
const groupedByRRN = _.groupBy(data, 'RRN'); // Regrouper par RRN

const results = Object.entries(groupedByRRN).map(([rrn, transactions]) => {
    // Calculer les totaux pour chaque RRN
    const totalDebit = _.sumBy(transactions, (t) => parseFloat(t['Débit (XOF)']) || 0);
    const totalCredit = _.sumBy(transactions, (t) => parseFloat(t['Crédit (XOF)']) || 0);

    return {
        RRN: rrn,
        Occurrences: transactions.length,
        TotalDebit: totalDebit,
        TotalCredit: totalCredit,
        Ecart: totalDebit - totalCredit,
        Transactions: transactions
    };
});

// Étape 2: Identifier les anomalies
const anomalies = results.filter((res) => res.Occurrences !== 2 || res.Ecart !== 0);

// Étape 3: Sauvegarder les anomalies dans un fichier Excel
const anomaliesSheet = xlsx.utils.json_to_sheet(anomalies);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, anomaliesSheet, 'Anomalies');
xlsx.writeFile(newWorkbook, './anomalies.xlsx');

console.log('Rapprochement terminé. Les anomalies ont été sauvegardées dans "anomalies.xlsx".');
