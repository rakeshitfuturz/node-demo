let events = require("./admin.event");
let senders = require("./admin.sender");

module.exports = (client) => {
  client.on(events.ON_ADMIN_LOGIN, (payload) => {
    senders.onAdminLogin(payload);
  });
};