const router = require("express").Router();

router.get("/", (req, res) => {
	req.logout(req.user, (err) => {
		if (err) return next(err);
		res.redirect("/");
	});
});

module.exports = router;
