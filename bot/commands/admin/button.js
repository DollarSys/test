const Discord = require('discord.js');
const DiscordOauth2 = require("discord-oauth2");

module.exports = {
    name: 'button',
    description: 'descriptions here',
    run: async(client, message, args) => {
        const oauth = new DiscordOauth2({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: client.config.login_link,
        });
        
        const url = oauth.generateAuthUrl({
            scope: ["identify", "guilds", "guilds.join"],
        });

        message.channel.send({ content: `> **Click on __Verify Me__ button to get verified roles.**`, components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder({
                    label: 'Verify Me',
                    style: Discord.ButtonStyle.Link,
                    url,
                })
            )
        ] });
    }
}