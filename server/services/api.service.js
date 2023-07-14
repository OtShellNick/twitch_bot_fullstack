require("dotenv").config({ path: "../.env" });
const ApiGateway = require("moleculer-web");
const { Errors: { MoleculerError } } = require('moleculer');
const cookieParser = require('cookie-parser')
const cors = require("cors");
const db = require("../mongo");
const { checkJwtToken } = require('./../helpers/jwtToken');
const jwt = require('jsonwebtoken');
require('../helpers/watchChanges');

module.exports = {
	name: "api",
	version: 1,
	mixins: [ApiGateway],
	settings: {
		methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
		use: [
			cookieParser(),
			cors({
				origin: 'http://localhost:8088',
				credentials: true
			}),
		],
		port: process.env.SERVER_PORT || 3000,
		routes: [
			{
				name: 'api',
				path: "/",
				autoAliases: true,

				bodyParser: {
					json: true,
					urlencoded: { extended: true },
				},
				whitelist: [
					"$node.*",
					"v1.api.*",
				],
			},
			{
				name: 'auth',
				path: "/",
				autoAliases: true,

				bodyParser: {
					json: true,
					urlencoded: { extended: true },
				},
				whitelist: [
					"v1.auth.*",
				],
			},
			{
				name: 'user',
				path: "/",
				autoAliases: true,
				authorization: true,
				bodyParser: {
					json: true,
					urlencoded: { extended: true },
				},
				whitelist: [
					"v1.user.*",
				]
			},
			{
				name: 'timers',
				path: "/",
				autoAliases: true,
				authorization: true,
				bodyParser: {
					json: true,
					urlencoded: { extended: true },
				},
				whitelist: [
					"v1.timers.*",
				],
			},
		],
	},

	methods: {
		authorize: async (ctx, route, req, res) => {
			const { wbautht } = req.cookies;

			if (!wbautht) throw new MoleculerError('Unauthorized user', 401, 'UNAUTHORIZED', { message: 'Unauthorized user' });

			try {
				const data = await checkJwtToken(wbautht);
				console.log('jwt', data);

				ctx.meta.session = data;

				return Promise.resolve(ctx);
			} catch (err) {
				if (err instanceof jwt.TokenExpiredError) {
					throw new MoleculerError('Token expired!', 401, 'TOKEN_EXPIRED', { message: 'Token expired!' })
				}

				if (err instanceof jwt.JsonWebTokenError) {
					throw new MoleculerError('Invalid Token', 401, 'INVALID_TOKEN', { message: 'Invalid Token' });
				}

				throw new MoleculerError(
					err.message || 'Internal server error',
					err.code || 500,
					err.type || 'INTERNAL_SERVER_ERROR',
					err.data || { error: 'Internal server' }
				);
			}
		}
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
