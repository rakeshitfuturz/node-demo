let events = require("./customer.event");
let senders = require("./customer.sender");

module.exports = (client) => {
  client.on(events.ON_CUSTOMER_LOGIN, (payload) => {
    senders.onCustomerLogin(payload);
  });
};