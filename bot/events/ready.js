const { ActivityType } = require('discord.js')

module.exports = {
	name: 'ready',
	async execute(client) {
		console.log(`${client.user.tag} is online and ready to go!`);

        client.user.setActivity('Rolex.', { type: ActivityType.Watching });
        client.user.setPresence({ status: 'dnd' });
	},
};