'use strict';

const { getAccessToken, deleteChatMessage } = require("../methods/twitch.methods");
const WebSocketClient = require('websocket').w3cwebsocket;
const { sendFromBot } = require("./masterConnection");
const parseMessage = require('../helpers/parseMessage');
const db = require("../methods/db.methods");
const moment = require('moment');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }
let connWatcher = new MyEmitter();

const { BOT_ACCOUNT } = process.env;

class TwitchSocket {
  constructor(id, channel) {
    this.channel = channel.toLowerCase();
    this.event = new MyEmitter();
    this.maxEmotes = 0;
    this.capsBan = 0;
    this.timers = {};
    this.id = id;
  }

  async getAccessToken() {
    await new Promise(async (resolve, reject) => {
      let now = parseInt(Date.now() / 1000);

      if(!this.expire_time || this.expire_time > now) {

        await getAccessToken(this.refresh_token)
          .then((refreshData) => {

            this.expire_time = now + refreshData.expires_in;
            this.access_token = refreshData.access_token;
          })
          .catch(async (err) => {

            if(err.data.message == 'Invalid refresh token') {
              await db.editRow('users',
                { id: this.id },
                { bot_status: 2 }
              );
            }

            reject(err);
          });
      }

      resolve();
    });
  }

  async connect(refresh_token) {
    await new Promise(async (resolve, reject) => {
      try {
        this.refresh_token = refresh_token;
        await this.getAccessToken();

        this.client = new WebSocketClient('ws://irc-ws.chat.twitch.tv:80');

        this.client.onopen = () => {
          this.client.send(`PASS oauth:${this.access_token}`);
          this.client.send(`NICK ${BOT_ACCOUNT}`);
          this.client.send(`JOIN #${this.channel}`);
          this.client.send('CAP REQ :twitch.tv/commands twitch.tv/tags twitch.tv/membership');

          resolve();
        }

        this.client.onerror = (error) => {
          console.log("Connection error:");
          console.log(error);

          this.clear();

          connWatcher.emit("error", this.id);
        }

        this.client.onclose = async (error) => {
          console.log("Connection to Twitch was closed");
          console.log(error);

          this.clear();

          // в зависимости от ошибки, пытаться переподключить
          // если ошибка в токене, записать в базу статус 2

          if (error.code == 1006) {
            // попробовать переподключиться
          }

          connWatcher.emit("close", this.id);
        }

        this.client.onmessage = async (message) => {
          console.log("Message", message.data);
          let parsed = parseMessage(message.data);

          switch (parsed.type) {
            case 'PING':
              this.client.send('PONG :tmi.twitch.tv\r\n');
              break;

            case 'PRIVMSG':
              if (parsed.displayName.toLowerCase() != BOT_ACCOUNT) {
                let deleted = 0;

                if(this.maxEmotes && parsed.emotes > this.maxEmotes || this.capsBan && parsed.caps > 5){
                  await this.getAccessToken();

                  await deleteChatMessage(this.id, parsed.msgId, this.access_token)
                    .then(() => deleted = 1)
                    .catch((err) => {
                      console.log("Error in deleteChatMessage", err);
                    })
                }

                if(deleted == 0) this.event.emit('message');

                await db.addRow('chat_logs', {
                  user_id: parsed.userId,
                  display_name: parsed.displayName,
                  message_id: parsed.msgId,
                  message: parsed.message,
                  channel: this.channel,
                  date: new Date(),
                  deleted
                });

                let time = moment().utc().format('YYYY-MM-DD HH:mm');

                await db.incRow('statistics', 
                  { user_id: this.id }, 
                  { [`messages.${time}`]: 1, total_messages: 1 }
                );

              }
              break;

            default:
              break;
          }
        }
      }
      catch (err) {
        connWatcher.emit('error', this.id);
        resolve();
      }
    });
  }

  clear() {
    for (let timer in this.timers) {
      clearInterval(this.timers[timer].intervalObj);
      this.event.removeListener('message', this.timers[timer].listener);

      delete this.timers[timer];
    }
  }

  disconnect() {
    this.client.close();
    this.client = null;
  }

  startTimer(_id, message, sec, chatLines, announce) {
    message = announce ? '/announce ' + message : message;

    this.timers[_id] = {
      chatLines,
      mesgCount: 0,
      listener: () => this.timers[_id].mesgCount++
    };

    this.event.on('message', this.timers[_id].listener);

    this.timers[_id].intervalObj = setInterval(async () => {
      if (this.timers[_id].mesgCount >= chatLines || !chatLines) {
        //this.client.send(`PRIVMSG #${this.channel} :${message}`);
        console.log("SEND MESSAGE");
        sendFromBot(`PRIVMSG #${this.channel} :${message}`);
        this.timers[_id].mesgCount = 0;
      }
    }, sec * 1000);
  }

  stopTimer(_id) {
    if (this.timers[_id]) {
      clearInterval(this.timers[_id].intervalObj);
      this.event.removeListener('message', this.timers[_id].listener);

      delete this.timers[_id];
    }

    if (!this.isBusy()) this.disconnect();
  }

  restartTimer(_id, message, sec, chatLines, announce) {
    clearInterval(this.timers[_id].intervalObj);
    this.event.removeListener('message', this.timers[_id].listener);

    this.startTimer(_id, message, sec, chatLines, announce);
  }

  setMaxEmotes(max) {
    this.maxEmotes = max;
  }

  setCapsMode(caps) {
    this.capsBan = caps;
  }

  isBusy() {
    if (Object.keys(this.timers).length) {
      return true;
    }

    return false;
  }

}

module.exports = { TwitchSocket, connWatcher };