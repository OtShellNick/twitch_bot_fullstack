'use strict';

module.exports = (message) => {
  let msgTypes = ['PING', 'PRIVMSG'];
  let type;

  for (let i of msgTypes) {
    if (message.includes(i)) {
      type = i;
      break;
    }
  }

  let result = {};
  if (type) result.type = type;

  switch (type) {
    case 'PRIVMSG':

      let data = message.split(' ')[0].split(';');

      for (let i of data) {
        if (i.includes('emotes=')) {
          result.emotes = 0;
          let emotes = i.replace('emotes=', '')

          if (emotes.length) {
            emotes = emotes.split('/');

            let positions = emotes.map(item => {
              let pos = item.match(/(?<=\d+:).+/);
              if (pos) item = pos[0];
              return item;
            });

            let count = [];
            for (let pos of positions) {
              count = [...count, ...pos.split(',')];
            }

            result.emotes = count?.length;
          }
        }

        else if (i.includes('user-id=')) {
          result.userId = i.replace('user-id=', '');
        }

        else if (i.substring(0, 3).includes('id=')) {
          result.msgId = i.replace('id=', '');
        }

        else if (i.includes('display-name=')) {
          result.displayName = i.replace('display-name=', '');
        }
      }

      let msg = message.match(/(?<=PRIVMSG\s#.+\s:).+/);
      if(msg) {
        result.message = msg[0];

        let caps = msg[0].match(/\p{Lu}/gu);
        result.caps = caps ? caps.length : 0;
      }

      break;

    default:
      break;
  }

  return result;
}