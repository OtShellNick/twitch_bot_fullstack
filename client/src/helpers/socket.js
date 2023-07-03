import { io } from 'socket.io-client';

export default class Socket {
	constructor(token) {
		this.interval = null;
		this.token = token;
		this.socket = io(`${SOCKET_URI}`, {
			autoConnect: false,
			transports: ['websocket'],
			auth: {
				token,
			},
		});
	}

	connect = () => {
		this.socket.connect();

		this.socket.on('connect', () => {
			this.#healthCheck();

			this.interval = setInterval(() => {
				this.#healthCheck();
			}, 60000 * 1);
		});
	};

	#healthCheck = () => this.socket.emit('call', 'socket.check.health', {}, console.log);

	disconnect = () => {
		this.socket.disconnect();

		if (this.interval) clearInterval(this.interval);
	};
}
