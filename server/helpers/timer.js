const { eventEmitter } = require('./emiter');

/**
 * Класс `TimerController` представляет собой контроллер для управления таймерами в различных каналах.
 */
class TimerController {
  /**
   * Создает новый экземпляр класса `TimerController`.
   * @param {Object} timers - Объект с таймерами, где ключ - название канала, значение - массив таймеров для этого канала.
   */
  constructor(timers = {}) {
    /** @type {Map<string, Array<Object>>} */
    this.timers = new Map(Object.entries(timers).map(([channel, channelTimers]) => [`#${channel}`, [...channelTimers]]));

    /** @type {Map<string, number>} */
    this.messageCounters = new Map(Object.entries(timers).map(([channel]) => [`#${channel}`, 0]));

    this.#registerListeners();

    console.log('Timers', this.timers);
    console.log('Message counters', this.messageCounters);
  }

  /**
   * Добавляет таймеры для указанного канала.
   * @param {string} channel - Название канала.
   * @param {Array<Object>} timers - Массив таймеров для указанного канала.
   */
  addTimer(channel, timers) {
    if (!this.timers.has(channel)) {
      this.timers.set(channel, []);
      this.messageCounters.set(channel, 0);
    }

    const channelTimers = this.timers.get(channel);
    channelTimers.push(...timers);
  }

  /**
 * Обновляет указанный таймер в указанном канале.
 * @param {string} channel - Название канала.
 * @param {Object} updatedTimer - Обновленные данные таймера.
 */
updateTimer(channel, updatedTimer) {
  const channelTimers = this.timers.get(channel);
  if (channelTimers) {
    const index = channelTimers.findIndex(t => t._id.toString() === updatedTimer._id.toString());
    if (index !== -1) {
      channelTimers[index] = updatedTimer;
    }
  }
}


  /**
   * Удаляет указанный таймер из указанного канала.
   * @param {string} channel - Название канала.
   * @param {Object} timer - Таймер для удаления.
   */
  removeTimer(channel, timer) {
    if (this.timers.has(channel)) {
      const channelTimers = this.timers.get(channel);
      const updatedTimers = channelTimers.filter(t => t._id.toString() !== timer._id.toString());
      this.timers.set(channel, updatedTimers);
    }
  }

  /**
   * Запускает указанный таймер в указанном канале.
   * @param {string} channel - Название канала.
   * @param {string} timerId - Идентификатор таймера.
   */
  startTimer(channel, timerId) {
    const channelTimers = this.timers.get(channel);
    if (channelTimers) {
      const timer = channelTimers.find(t => t._id.toString() === timerId);
      if (timer) {
        timer.start();
      }
    }
  }

  /**
   * Останавливает указанный таймер в указанном канале.
   * @param {string} channel - Название канала.
   * @param {string} timerId - Идентификатор таймера.
   */
  stopTimer(channel, timerId) {
    const channelTimers = this.timers.get(channel);
    if (channelTimers) {
      const timer = channelTimers.find(t => t._id.toString() === timerId);
      if (timer) {
        timer.stop();
      }
    }
  }

  /**
   * Возвращает все таймеры из всех каналов в виде одного массива.
   *
   * @returns {Array<Object>} - Массив всех таймеров.
   */
   getAllTimers() {
    return Array.from(this.timers.values()).flat();
  }

  /**
   * Возвращает таймеры для указанного канала.
   * @param {string} channel - Название канала.
   * @returns {Array<Object>} - Массив таймеров для указанного канала.
   */
  getChannelTimers(channel) {
    return this.timers.get(channel);
  }

  /**
   * Регистрирует слушатели событий.
   * @private
   */
  #registerListeners() {
    eventEmitter.on('message', this.#handleMessage.bind(this));
    eventEmitter.on('add_timer', ({ channel, timer }) => this.addTimer(`#${channel}`, [timer]));
    eventEmitter.on('update_timer', ({ channel, timer }) => this.updateTimer(`#${channel}`, timer));
    eventEmitter.on('delete_timer', ({channel, timer}) => this.removeTimer(`#${channel}`, timer));
  }

  /**
   * Удаляет зарегистрированные слушатели событий.
   * @private
   */
  #unregisterListeners() {
    eventEmitter.off('message', this.#handleMessage.bind(this));
  }

  /**
   * Обрабатывает событие сообщения и выполняет действия для соответствующих таймеров в указанном канале.
   * @param {Object} message - Объект сообщения.
   * @param {string} message.channel - Название канала.
   * @private
   */
  #handleMessage({ channel }) {
    if (!this.messageCounters.has(channel)) {
      this.messageCounters.set(channel, 0);
    }

    const messageCounter = this.messageCounters.get(channel);
    const currentCounter = messageCounter + 1;
    this.#updateMessageCounters(channel, currentCounter);

    const channelTimers = this.getChannelTimers(channel);

    channelTimers.forEach(timer => {
      if (currentCounter % timer.chat_lines === 0) {
        const message = timer.announce ? '/announce ' + timer.message : timer.message;

        setTimeout(() => eventEmitter.emit('send_privmsg', { channel, message }), 1000 * timer.interval);
      }
    });

    console.log('handleMessage', channelTimers);
  }

  /**
   * Обновляет счетчик сообщений для указанного канала.
   * @param {string} channel - Название канала.
   * @param {number} value - Новое значение счетчика.
   * @private
   */
  #updateMessageCounters(channel, value) {
    this.messageCounters.set(channel, value);
  }
}

module.exports = TimerController;
