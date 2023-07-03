'use strict';

const SocketIOService = require('moleculer-io');
const { decodeJwtToken } = require('../helpers/jwtToken');
const db = require("../methods/db.methods");

module.exports = {
	name: 'socket',
	mixins: [SocketIOService],
	settings: {
		port: 5000,
		io: {
			namespaces: {
				'/': {
					authorization: true,
				},
			},
		},
	},

	actions: {
		async ['check.health'](ctx) {
			let id = ctx.meta?.user?.id;

			if (!id) {
				return { error: 'INVALID_TOKEN', status: 403 };
			}

			let user = await db.getRow('users', {id});
			if(!user){
				return { error: 'USER_NOT_FOUND', status: 400 };
			}

			return {status: 200, bot_status: user.bot_status};
		},
	},

	methods: {
		async socketAuthorize(socket, eventHandler) {
			let accessToken = socket.handshake.auth.token;

			if (accessToken) {
				try {
					return decodeJwtToken(accessToken);
				} catch (err) {
					console.log(err);
				}
			} else {
				// anonymous user
				return;
			}
		},
	},
};
