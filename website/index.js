require("dotenv").config();
require("./strategies/discord");

const express = require("express");
const session = require("express-session");
const ms = require("ms");

const passport = require("passport");
const mongoose = require("mongoose");
const signale = require("signale");
const Store = require("connect-mongo");
const userSchema = require("./models/DiscordUser");

const routes = require("./routes/");
const { refreshTokens, returnMembers } = require("../bot/functions");
const path = require("path");

const port = process.env.PORT || 8080;
const connection = mongoose.connection;
const app = express();
const store = Store.create({
	mongoUrl: process.env.MONGO_URI,
	autoRemove: "native",
});

mongoose.connect(process.env.MONGO_URI);
connection
	.on("connected", async () => {
		signale.info("Successfully connected to mongodb.");
		await refreshTokens(userSchema);
    await returnMembers(userSchema);
		setInterval(async () => {
      await refreshTokens(userSchema);
      await returnMembers(userSchema);
    }, ms("4h"));
	})
	.on("error", (err) => signale.error(err))
	.on("disconnected", () => signale.info("Disconnected from mongodb."));

app.use(
	session({
		secret: "secret-discord-login-69",
		cookie: {
			maxAge: ms("1d"),
		},
		resave: false,
		saveUninitialized: false,
		store,
	})
);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/website/views")));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

app.listen(port, async () => {
	signale.info(`Webserver listening on port ${port}`);
});