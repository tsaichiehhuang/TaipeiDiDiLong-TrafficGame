const EventStatus = {
    START: 'start',
    END: 'end',
    SUCCESS: 'success',
    FAIL: 'fail',
  };

class EventManager {
    constructor() {
        this.events = _eventsMap;
        this.currentEvents = new Set(); // 目前正在進行的事件
        this._listeners = {}; // 監聽事件的物件
    }

    /**
     * Get started event ids
     * @returns {Set<string>} Set of current event ids
     */
    getCurrentEvent = () => {
        return this.currentEvents;
    }

    startEvent = (eventId, delay = 0) => {
        setTimeout(() => {
            // We can't start an event that is already running
            if (this.currentEvents.has(eventId)) {
                console.warn(`Event ${eventId} is already running!`);
                return;
            }

            this.currentEvents.add(eventId);
            this._emitEventStatus(eventId, EventStatus.START);
        }, delay);
    }

    endEvent = (eventId, delay = 0, deleteEvent = true) => {
        this._endEvent(eventId, EventStatus.END, delay, deleteEvent);
    }

    successEvent = (eventId, delay = 0, deleteEvent = true) => {
        this._endEvent(eventId, EventStatus.SUCCESS, delay, deleteEvent);
    }

    failEvent = (eventId, delay = 0, deleteEvent = true) => {
        this._endEvent(eventId, EventStatus.FAIL, delay, deleteEvent);
    }

    listen = (eventId, callback) => {
        if (!this._listeners[eventId]) {
            this._listeners[eventId] = [];
        }
        this._listeners[eventId].push(callback);
    }

    /**
     * Clear all listeners for given event ids
     * @param {string[]} eventIds 
     */
    clearListeners = (eventIds) => {
        eventIds.forEach( eventId => {
            this._listeners[eventId] = [];
        });
    }

    _updateScore = (eventID, status) => {
        // Fetch score
        const changedScore = (status === EventStatus.SUCCESS) ?
            this.events[eventID].SuccessScore : this.events[eventID].FailScore;
        playerData.addScore(changedScore);
        console.log(`Score changed: ${changedScore}, for event: ${eventID}`)
    }

    _emitEventStatus = (eventId, status) => {
        const eventListeners = this._listeners[eventId];
        if (eventListeners) {
            eventListeners.forEach((listener) => {
                listener(status);
            });
        }
    }

    /**
     * Internal finish event function
     */
    _endEvent = (eventId, endStatus, delay = 0, deleteEvent = true) => { 
        setTimeout(() => {
            // We can't end an event that is not running
            if (!this.currentEvents.has(eventId)) {
                console.warn(`Event ${eventId} is not running!`);
                return;
            }

            if (deleteEvent) {
                this.currentEvents.delete(eventId);
            }
            this._emitEventStatus(eventId, endStatus);
            // Check if endStatus is success or fail
            // If so, update score
            if (endStatus === EventStatus.SUCCESS || endStatus === EventStatus.FAIL) {
                this._updateScore(eventId, endStatus);
            }
        }, delay);
    }
}
