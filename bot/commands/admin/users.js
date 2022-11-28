const Discord = require('discord.js');
const userSchema = require('../../../website/models/DiscordUser');

module.exports = {
    name: 'users',
    description: 'descriptions here',
    run: async(client, message, args) => {
        let data = (await userSchema.find()) || [];

        userSchema.count({}, function (err, count) {
            if (err)
              return message.channel.send(`There are **1** authorized members!`);
            message.channel.send(`There are **${count}** authorized members!`);
        });
    }
}