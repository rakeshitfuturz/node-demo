const { Server } = require("socket.io");
const { SOCKET_ROOMS } = require("../config/constants");

module.exports = {
  initializeSocketServer: (httpServer) => {
    console.log("Socket IO attached!");
    const io = new Server(httpServer, { rejectUnauthorized: false });
    io.on("connection", function (client) {
      client.on("init", async function (user) {
        if (user.userType) {
          let ROOMS = SOCKET_ROOMS.map((v) =>
            `${user.userType}`.toLowerCase()
          );
          switch (`${user.userType}`) {
            case ROOMS[0]: {
              client.join(ROOMS[0]);
              io.in(ROOMS[0]).emit("connector", user);
              console.log(`${user.name} is joined with ${ROOMS[0]}!`);
              break;
            }
            case ROOMS[1]: {
              client.join(ROOMS[1]);
              io.in(ROOMS[1]).emit("connector", user);
              console.log(`${user.name} is joined with ${ROOMS[1]}!`);
              break;
            }
            case ROOMS[2]: {
              client.join(ROOMS[2]);
              io.in(ROOMS[2]).emit("connector", user);
              console.log(`${user.name} is joined with ${ROOMS[2]}!`);
              break;
            }
            default: {
              console.log("Warning: -> Invalid socket user.");
              break;
            }
          }
        }
      });

      require("./customer/customer.receiver")(client);
      require("./admin/admin.receiver")(client);
      require("./rider/rider.receiver")(client);
    });
    global.io = io;
  },
};