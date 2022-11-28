const Discord = require("discord.js");
const DiscordOauth2 = require("discord-oauth2");

const userSchema = require("../../../website/models/DiscordUser");

module.exports = {
	name: "add-members",
	description: "descriptions here",
	run: async (client, message, args) => {
		let data = (await userSchema.find()) || [];
		if (data.length < 1) return message.reply(":x: **There is no members.**");

		const oauth = new DiscordOauth2({
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
		});

		let s = 0;
		let f = 0;

		let roles = [];
		let count = (await userSchema.count()) || 1;
		if (typeof client.config.guilds[message.guild.id] == "object")
			roles = client.config.guilds[message.guild.id].roles;

		data.forEach(async (user) => {
			if (data.indexOf(user) == count - 1) {
				oauth
					.addMember({
						accessToken: user.accessToken,
						botToken: client.config.token,
						guildId: message.guild.id,
						userId: user.discordId,
						roles,
					})
					.then(() => s++)
					.catch(() => f++);
                
                await delay(3000);
				message.channel.send(
					`**⏰ Tried to add ${count} members!**\n\n☑️ Added **${s}**\n:x: Failed **${f}**`
				);
				return;
			}
			oauth
				.addMember({
					accessToken: user.accessToken,
					botToken: client.config.token,
					guildId: message.guild.id,
					userId: user.discordId,
					roles,
				})
				.then(() => s++)
				.catch(() => f++);
		});
	},
};

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
