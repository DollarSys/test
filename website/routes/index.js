const router = require("express").Router();

const home = require("./home");
const login = require("./login");
const logout = require("./logout");

router.use("/", home);
router.use("/login", login);
router.use("/logout", logout);

module.exports = router;
