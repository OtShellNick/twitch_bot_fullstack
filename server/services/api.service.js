require("dotenv").config({ path: "../.env" });
const ApiGateway = require("moleculer-web");
const { createJwtToken, decodeJwtToken } = require("../helpers/jwtToken");
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

				onBeforeCall: ({ meta }, route, req, res) => {
					const { authorization } = req.headers;
					if (authorization) {
						try{
							meta.session = decodeJwtToken(authorization);
						} catch(err){
							console.log(err);
						}

						// выгнать по истечению токена
					}
				},

				onAfterCall: ({ meta }, route, req, res, data) => {
					const { session } = meta;
					
					if (session){ 
						let token = createJwtToken(session);
						res.setHeader("Authorization", token);
						console.log(token);
					}
					return data;
				}
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
