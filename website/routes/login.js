const router = require("express").Router();
const passport = require("passport");
const { addRoles } = require("../../bot/functions");

router.get("/", passport.authenticate("discord"));

router.get(
	"/redirect",
	passport.authenticate("discord", {
		failureRedirect: "/login",
		successRedirect: "/",
	}),
	async (req, res) => {
		if (req.user) {
			await addRoles(req.user.discordId);
		}
		res.send(200);
	}
);

module.exports = router;
