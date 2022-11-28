const fs = require("node:fs");
const path = require("node:path");

function event(client) {
	const eventsPath = path.join(__dirname, "../events");

	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);

		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

module.exports = event;
