const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const ascii = require("ascii-table");
const table = new ascii().setHeading("Nom du fichier", "Type", "Status");
const config = require('../config.js');

const clientId = config.clientId;
const token = config.token;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                const fileName = `⌨️  | ${file}`.replace('.js', '');

                if (command.name) {
                    client.commands.set(command.name, command);
                    table.addRow(fileName, folder, "Chargé");
                } else {
                    table.addRow(fileName, folder, "Chargé");
                    continue;
                }
            }
        }

        const color = {
            red: '\x1b[31m',
            orange: '\x1b[38;5;202m',
            yellow: '\x1b[33m',
            green: '\x1b[32m',
            blue: '\x1b[34m',
            reset: '\x1b[0m'
        }

        function getTimestamp() {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        console.log(`${color.green}${table.toString()} \n[${getTimestamp()}] ${color.reset}[COMMANDS] Chargé ${client.commands.size} commandes slash (/).`);

        const rest = new REST({
            version: '9'
        }).setToken(token);

        (async () => {
            try {
                client.logs.info(`[FONCTION] Démarrage de l’actualisation des commandes de l’application (/).`);

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                client.logs.success(`[FONCTION] Commandes d’application (/) rechargées avec succès.`);
            } catch (error) {
                client.logs.error('[FONCTION] Erreur de chargement des commandes slash.', error);
            }
        })();
    };
};