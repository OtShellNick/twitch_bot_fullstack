require("dotenv").config({ path: "../.env" });

const ApiGateway = require("moleculer-web");
const { Errors: { MoleculerError } } = require('moleculer');
const cors = require("cors");
const db = require("../mongo");
const { checkJwtToken } = require('../helpers/jwtToken');
const jwt = require('jsonwebtoken');
require('../helpers/watchChanges');

/**
 * Модуль для настройки и запуска API-шлюза.
 * @module apiService
 */

module.exports = {
    name: "api",
    version: 1,
    mixins: [ApiGateway],

    /**
     * Настройки API-шлюза.
     * @property {string} origin - Разрешенные источники запросов (CORS).
     * @property {string[]} methods - Разрешенные методы запросов.
     * @property {Function[]} use - Массив функций промежуточного обработчика запросов.
     * @property {number} port - Порт, на котором будет запущен API-шлюз.
     * @property {Object[]} routes - Массив настроек маршрутов API-шлюза.
     */
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
                /**
                 * Функция, вызываемая после обработки запроса.
                 * @param {Object} ctx - Контекст запроса.
                 * @param {Object} route - Настройки текущего маршрута.
                 * @param {Object} req - Объект запроса Express.
                 * @param {Object} res - Объект ответа Express.
                 * @param {any} data - Данные, возвращаемые из обработчика запроса.
                 * @returns {any} - Данные, передаваемые дальше по цепочке обработки запроса.
                 */
                onAfterCall: (ctx, route, req, res, data) => {
                    const {data: token} = data;
                    if(token) res.setHeader('Authorization', token);

                    return data;
                },
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
				name: 'timer',
				path: "/",
				autoAliases: true,
				authorization: true,
				bodyParser: {
					json: true,
					urlencoded: { extended: true },
				},
				whitelist: [
					"v1.timer.*",
				]
			},
        ],
    },

    methods: {
		authorize: async (ctx, route, req, res) => {
			const { authorization } = req.headers;

			if (!authorization) throw new MoleculerError('Unauthorized user', 401, 'UNAUTHORIZED', { message: 'Unauthorized user' });

			try {
				const data = await checkJwtToken(authorization);

				ctx.meta.session = data;

				return Promise.resolve(ctx);
			} catch (err) {
				if (err instanceof jwt.TokenExpiredError) {
					throw new MoleculerError('Token expired!', 403, 'TOKEN_EXPIRED', { message: 'Token expired!' })
				}

				if (err instanceof jwt.JsonWebTokenError) {
					throw new MoleculerError('Invalid Token', 403, 'INVALID_TOKEN', { message: 'Invalid Token' });
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

    /**
     * Функция, вызываемая при запуске службы.
     * @async
     */
    async started() {
        db.connect('mongodb://mongo1:27017', (err) => {
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
