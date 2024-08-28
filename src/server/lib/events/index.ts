import * as events from 'events';

class EventRegistry extends events.EventEmitter {
  onMany(arr, onEvent) {
    const self = this;

    arr.forEach(function (eventName) {
      self.on(eventName, onEvent);
    });
  }
}

export const GlobalEventRegistry = new EventRegistry();
GlobalEventRegistry.setMaxListeners(120);
