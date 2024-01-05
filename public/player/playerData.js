class PlayerData {
  constructor() {
    this._trafficTickets = []; // 罰單們

    this._scoreCallbacks = new Map();
    this._nextCallbackId = 0;

    this.initScore = 300; // 初始分數
    this._score = this.initScore;
  }

  addTrafficTicket = (title, amount) => {
    let ticket = new TrafficTicket(title, amount);
    this._trafficTickets.push(ticket);
  };

  addScore = (scoreChange) => {
    if (scoreChange === 0) {
      return;
    }
    this._score += scoreChange;
    this._score = Math.max(this._score, 0); // 最低就是 0 分

    this._scoreCallbacks.forEach((callback) => {
      callback(this._score);
    });
  };

  getTrafficTickets = () => {
    return this._trafficTickets;
  };

  getScore = () => {
    return this._score;
  };

  onScoreChange = (callback) => {
    let callbackId = this._nextCallbackId++;
    this._scoreCallbacks.set(callbackId, callback);

    // In case need to cancel, you can use cancelOnScoreChange with the callbackId
    return callbackId;
  };

  cancelOnScoreChange = (callbackId) => {
    this._scoreCallbacks.delete(callbackId);
  };
}

class TrafficTicket {
  constructor(title, amount) {
    this.title = title;
    this.amount = amount;
  }
}
