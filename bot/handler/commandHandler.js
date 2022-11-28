const fs = require("fs");
const path = require("path");

const flatten = (lists) => {
	return lists.reduce((a, b) => a.concat(b), []);
};

const getDirectories = (srcpath) => {
	return fs
		.readdirSync(srcpath)
		.map((file) => path.join(srcpath, file))
		.filter((path) => fs.statSync(path).isDirectory());
};

const getDirectoriesRecursive = (srcpath) => {
	return [
		srcpath,
		...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
	];
};

function command(client) {
	const commandCategories = getDirectoriesRecursive(
		path.join(__dirname, "../commands")
	);

	for (let i = 0; i < commandCategories.length; i++) {
		const category = commandCategories[i];
		const commands = fs.readdirSync(category).filter((f) => f.endsWith(".js"));

		commands.forEach((commandName) => {
			const command = require(path.join(category, commandName));
			client.commands.set(command.name, command);
		});
	}
}

module.exports = command;
