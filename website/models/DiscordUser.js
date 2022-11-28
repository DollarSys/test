const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	discordId: { type: String, required: true },
	username: { type: String, required: true },
	discriminator: { type: String, required: true },
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	guilds: { type: Array, required: true },
});

module.exports = mongoose.model("DiscordUser", UserSchema);
