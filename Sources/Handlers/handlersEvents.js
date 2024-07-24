const ascii = require('ascii-table')
const fs = require('fs')
const table = new ascii().setHeading("Nom du fichier", "Type", "Status");

module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {

        const folders = fs.readdirSync("./src/evenements");
        for (const folder of folders) {
            const files = fs.readdirSync(`./src/evenements/${folder}`).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const event = require(`../evenements/${folder}/${file}`)
                if (event.rest) {
                    if (event.once) {
                        client.rest.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.rest.on(event.name, (...args) => event.execute(...args, client));
                    }
                } else {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }

                const fileName = `📅  | ${file}`.replace('.js', '');

                table.addRow(fileName, folder, "Chargé")
                continue;
            }
        }
        return console.log(table.toString(), "\nLoaded Events.")
    }
}