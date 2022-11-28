require('dotenv').config();
const { Client, GatewayIntentBits: gib, Collection } = require("discord.js");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const client = new Client({
    intents: [
        gib.Guilds,
        gib.GuildEmojisAndStickers,
        gib.DirectMessages,
        gib.GuildBans,
        gib.MessageContent,
        gib.GuildInvites,
        gib.GuildWebhooks,
        gib.GuildMessages,
        gib.GuildMembers,
        gib.GuildIntegrations,
        gib.GuildVoiceStates,
        gib.GuildMessageReactions
    ],
});

// // Global Variables
client.commands = new Collection();
client.config = require("./config");

// // Initializing the project
['command', 'event'].forEach((c) => require("./handler/" + c + 'Handler')(client));

client.login(client.config.token);
mongoose.connect(client.config.mongo);

connection
  .on("connected", async () => { 
    console.info("Successfully connected to mongodb.")
})
  .on("error", (err) => console.error(err))
  .on("disconnected", () => console.info("Disconnected from mongodb."));

module.exports = client;