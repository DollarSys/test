const client = require("./index");
const config = require("./config");

const DiscordOauth2 = require("discord-oauth2");
const { JsonDatabase } = require("wio.db");
const fetch = require("node-fetch").default;

const db = new JsonDatabase({
	databasePath: "\\databases\\autoAdd.json",
});

async function removeMember(id) {
	const guilds = Object.keys(config.guilds) || [];
	if (guilds.length < 1) return;

	guilds.forEach(async (guildId) => {
		const guild = client.guilds.cache.get(guildId);
		if (!guild) return;

		const member = await guild.members.fetch({ user: id, force: true });
		if (member) {
			if (config.guilds[guildId].roles.length < 1) return;
			config.guilds[guildId].roles.forEach((roleId) => {
				member.roles.remove(roleId).catch(() => 0);
			});
		} else {
			return;
		}
	});
}

async function addRoles(id) {
	const guilds = Object.keys(config.guilds) || [];
	if (guilds.length < 1) return;

	guilds.forEach(async (guildId) => {
		const guild = client.guilds.cache.get(guildId);
		if (!guild) return;

		const member = await guild.members.fetch({ user: id, force: true });
		if (member) {
			if (config.guilds[guildId].roles.length < 1) return;
			config.guilds[guildId].roles.forEach((roleId) => {
				member.roles.add(roleId).catch(() => 0);
			});
		} else {
			return;
		}
	});
}

async function refreshTokens(userSchema) {
	let data = (await userSchema.find()) || [];
	if (data.length < 1) return;

	data.forEach(async (user) => {
		await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${user.refreshToken}`,
		}).then(async (res) => {
			let data = await res.json();
			if (data.error) {
				signale.info(user.discordId + " has been deleted!");
				await removeMember(user.discordId);
				return await userSchema.deleteOne({ discordId: user.discordId });
			}
			await userSchema.updateOne(
				{ discordId: user.discordId },
				{ accessToken: data.access_token, refreshToken: data.refresh_token },
				{ new: true }
			);
		});
	});
}

async function returnMembers(userSchema) {
	const dateOfStart = new Date();
	const lastAdded = (await db.fetch(`last_added`)) || dateOfStart;

	if (
		dateDiffInDays(dateOfStart, new Date(lastAdded)) < 2 &&
		new Date(lastAdded) !== dateOfStart
	)
		return;

	let data = (await userSchema.find()) || [];
	if (data.length < 1) return message.reply(":x: **There is no members.**");

	const oauth = new DiscordOauth2({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	});

	const guilds = Object.keys(config.guilds) || [];
	if (guilds.length < 1) return;

	const lastGuilds = (await db.fetch(`added`)) || [];

	if (lastGuilds.length < 1) {
		await db.set(`last_added`, dateOfStart);
		await db.push(`added`, guilds[0]);

		const guild = await client.guilds.fetch(restGuilds[0]);
		if (!guild) return;

		data.forEach(async (user) => {
			oauth
				.addMember({
					accessToken: user.accessToken,
					botToken: client.config.token,
					guildId: guild.id,
					userId: user.discordId,
					roles: client.config.guilds[guild.id].roles || [],
				})
				.catch(() => 0);
		});
	} else {
		const restGuilds = difference(lastGuilds, guilds);
		if (restGuilds.length == 1) await db.set(`added`, []);

		await db.set(`last_added`, dateOfStart);
		await db.push(`added`, restGuilds[0]);

		const guild = await client.guilds.fetch(restGuilds[0]);
		if (!guild) return;

		data.forEach(async (user) => {
			oauth
				.addMember({
					accessToken: user.accessToken,
					botToken: client.config.token,
					guildId: guild.id,
					userId: user.discordId,
					roles: client.config.guilds[guild.id].roles || [],
				})
				.catch(() => 0);
		});
	}
}

function dateDiffInDays(a, b) {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
}

function difference(a, b) {
	let ar = a;
	let arr = b;
	return arr.filter((x) => !ar.includes(x));
}

module.exports = { addRoles, removeMember, refreshTokens, returnMembers };
