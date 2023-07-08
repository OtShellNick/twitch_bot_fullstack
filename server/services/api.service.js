require("dotenv").config({ path: "../.env" });
const ApiGateway = require("moleculer-web");
const cors = require("cors");
const db = require("../mongo");
require('../helpers/watchChanges');

module.exports = {
	name: "api",
	version: 1,
	mixins: [ApiGateway],
	settings: {
		origin: "*",
		methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
		use: [
			cors({
				exposedHeaders: "Authorization",
			}),
		],
		port: process.env.SERVER_PORT || 3000,
		routes: [
			{
				path: "/",
				autoAliases: true,

				bodyParser: {
					json: true,
					urlencoded: { extended: true },
				},
				whitelist: [
					"$node.*",
					"v1.api.*",
					"v1.auth.*",
				],
			},
		],
	},

	async started() {
		db.connect('mongodb://mongo1:27017', function (err) {
			if (err) {
				console.log("Unable to connect to Mongo");
				console.log("error:", err);
				process.exit(1);
			} else {
				console.log("Connected to Mongo");
			}
		});
	},
};
