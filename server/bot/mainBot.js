const WebSocketClient = require('websocket').w3cwebsocket;
const {parseTwitchMessage} = require('./../helpers/twitchMessageParser');
const {eventEmitter} = require('./../helpers/emiter');

class TwitchChatClient {
  constructor(username, token, channels) {
    this.url = 'wss://irc-ws.chat.twitch.tv:443';
    this.username = username;
    this.token = token;
    this.channels = channels;
    this.socket = null;
  }

  #handleErorr(error) {
    console.error('Error connecting to Twitch chat:', error);
  }

  #handleOpen() {
    console.log('Connected to Twitch chat');
    
    this.sendCommand(`PASS oauth:${this.token}`);
    this.sendCommand(`NICK ${this.username}`);
    this.channels.forEach((channel) => {
      this.sendCommand(`JOIN ${channel}`);
    });
  }
  
  #handleMessage({data: message}) {
    const { username, eventType, channel, messageText } = parseTwitchMessage(message);

    console.log('Message from Twitch chat:', messageText);

    if  (eventType === 'PING') this.#pingHandler();
    if  (eventType === 'JOIN') this.#joinHandler({username, channel});
    if  (eventType === 'PRIVMSG') this.#privmsgHandler({username, channel, messageText});
    if  (eventType === 'PART') this.#partHandler({username, channel});
  }

  #handleClose(e) {
    console.log('Disconnected from Twitch chat', e);
    this.reconnect(); // Переподключение при отключении
  }

  #registerListeners() {
    eventEmitter.on('send_privmsg', ({ channel, message }) => this.sendMessage(channel, message));
  }

  #unregisterListeners() {
    
  }

  connect() {
    console.log('Connecting to Twitch chat...');

    this.socket = new WebSocketClient(this.url);

    this.socket.onerror = this.#handleErorr.bind(this);

    this.socket.onopen = this.#handleOpen.bind(this);

    this.socket.onmessage = this.#handleMessage.bind(this);

    this.socket.onclose = this.#handleClose.bind(this);

    this.#registerListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  reconnect() {
    console.log('Reconnecting to Twitch chat...');
    this.disconnect(); // Закрытие текущего соединения
    this.connect(); // Установка нового соединения
  }

  sendMessage(channel, message) {
    this.sendCommand(`PRIVMSG ${channel} :${message}`);
  }

  sendCommand(command) {
    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(command);
    }
  }

  #pingHandler() {
    console.log('Ping');
    this.sendCommand('PONG :tmi.twitch.tv');
  }

  #joinHandler({username, channel}) {
    console.log(`${username} joined ${channel}`);
  }

  #privmsgHandler({username, channel, messageText}) {
    console.log(`${username} from ${channel} said ${messageText}`);

    eventEmitter.emit('message', {username, channel, messageText});
  }

  #partHandler({username, channel}) {
    console.log(`${username} left ${channel}`);
  }

  addChannel(channel) {
    this.channels.push(channel);
  }

  removeChannel(channel) {
    this.channels.splice(this.channels.indexOf(channel), 1);
  }
}

module.exports = TwitchChatClient;