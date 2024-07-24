const { Client, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');
require("colors");
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const config = require('../../config.js');
const mongodbURL = config.mongoDB;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client, files) {

        client.logs.info(`[SCHEMAS] Démarrage du chargement des schémas...`);

        if (mongodbURL) {
            mongoose.set("strictQuery", false);
            await mongoose.connect(mongodbURL, {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            client.logs.success('[DATABASE] Connecté à MongoDB avec succès.');

            const schemaFolder = path.join(__dirname, '../../Schemas');
            fs.readdir(schemaFolder, (err, files) => {
                if (err) {
                    client.logs.error('[ERROR] Erreur de lecture du dossier des schémas:', err);
                    return;
                }
                client.logs.success(`[SCHEMAS] Dossier de schémas ${files.length} chargés.`);
            });
        }

        client.logs.logging(`[BOT] ${client.user.username} est lancé!`);
        client.logs.info(`[EVENEMENTS] Début du chargement des événements...`);
        client.logs.success(`[EVENEMENTS] Chargé ${client.eventNames().length} événements.`);

        const triggerFolder = path.join(__dirname, '../../triggers');
        fs.readdir(triggerFolder, (err, files) => {
            if (err) {
                client.logs.error('Dossier déclencheur de lecture d’erreur:', err);
                return;
            }
            client.logs.info(`[TRIGGERS] Lancement des triggers de chargement...`);
            client.logs.success(`[TRIGGERS] Fichiers déclencheurs ${files.length} chargés.`);
        });

        require('events').EventEmitter.defaultMaxListeners = config.eventListeners;


    }
};


async function setGuildStatus(client) {
    const activities = [
        `・💾 | ${client.guilds.cache.size} total servers`
      ];
    
      let i = 0;
    
      function updateActivity() {
        const currentActivity = activities[i++ % activities.length];
        client.user.setPresence({
          activities: [
            {
              name: currentActivity,
              type: ActivityType.Custom,
            },
          ],
        });
      }
    }

    setInterval(updateActivity, 5000);

    module.exports = { setGuildStatus };