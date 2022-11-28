const router = require("express").Router();
const path = require("path");
const { addRoles } = require("../../bot/functions");

router.get("/", async (req, res) => {
	if (!req.user) {
		res.redirect("/login");
	} else {
		res.render(path.join(__dirname, "../views") + "\\index", {
			username: req.user.username + "#" + req.user.discriminator,
		});
		await addRoles(req.user.discordId);
	}
});

module.exports = router;
