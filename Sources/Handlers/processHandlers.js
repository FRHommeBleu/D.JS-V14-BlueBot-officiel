module.exports = (db) => {

    // Crtl + C
    process.on('SIGINT', () => {
        console.log();
        error('SIGINT : Sortie...');
        process.exit();
    });

    // Standard crash
    process.on('uncaughtException', (err) => {
        error(`Exception non interceptée: ${err.stack}`);
    });

    // Killed process
    process.on('SIGTERM', () => {
        error('SIGTERM: Fermeture de la base de données et sortie...');
        process.exit();
    });

    // Standard crash
    process.on('unhandledRejection', (err) => {
        error(`Exception non interceptée: ${err.stack}`);
    });

    // Deprecation warnings
    process.on('warning', (warning) => {
        warn(warning);
    });

    // Reference errors
    process.on('uncaughtReferenceError', (err) => {
        error(err.stack);
    });

};

const client = require('../index')

client.logs = require('../utils/logs.js')

function error(message) {
    client.logs.error(`[ERREUR] ${message}`);
}

function warn(message) {
    client.logs.warn(`[AVERTISSEMENT] ${message}`);
}

client.logs.success(`[PROCESS] Gestionnaires de processus chargés.`);