function parseTwitchMessage(message) {
  const regex = /:(.*?)!(.*?)@(.*?) (.*?) (.*?) :(.+)/;
  const match = message.match(regex);

  if (match) {
    const [, username, , , eventType, channel, messageText] = match;
    const parsedMessage = { username, eventType, channel, messageText };

    if (eventType === 'PING') {
      // Обработка сообщения пинг
      delete parsedMessage.username;
      delete parsedMessage.channel;
      delete parsedMessage.messageText;
    }

    return parsedMessage;
  } else if (message.startsWith('PING')) {
    const pingMessage = {
      eventType: 'PING',
      messageText: message.split(' ')[1],
    };

    return { ...pingMessage, username: '', channel: '', messageText: '' };
  }

  return { username: '', eventType: '', channel: '', messageText: '' };
}

module.exports = {
  parseTwitchMessage
};