const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    Partials,
    TextInputStyle,
    TextInputBuilder,
    StringSelectMenu,
    isStringSelectMenu,
    ModalBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    PermissionsBitField,
    Permissions,
    MessageManager,
    InteractionType,
    Embed,
    Collection,
    Channel,
} = require(`discord.js`);
const fs = require("fs");
const client = new Client({
    intents: [3276799, Object.keys(GatewayIntentBits)],
    partials: [
        Partials.Channel,
        Partials.Reaction,
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
});

const config = require("./config.js");

const { setGuildStatus } = require("./evenements/Bot/status.js");

client.commands = new Collection();
client.guildSettings = new Collection();
client.aliases = new Collection();
client.setMaxListeners(0);

const handlers = fs
    .readdirSync("./src/handlers")
    .filter((file) => file.endsWith(".js"));
const eventFiles = fs
    .readdirSync("./src/evenements")
    .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

(async () => {
    for (file of handlers) {
        require(`./handlers/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/evenements");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(config.token)
})

client.on("ready", () => {
    setGuildStatus(client);
});