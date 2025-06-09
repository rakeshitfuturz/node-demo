let events = require("./rider.event");
let senders = require("./rider.sender");

module.exports = (client) => {
  client.on(events.ON_RIDER_LOGIN, (payload) => {
    senders.onRiderLogin(payload);
  });
};