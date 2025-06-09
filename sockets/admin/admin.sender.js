const { SOCKET_ROOMS } = require("../../config/constants");
const events = require("./admin.event");
function isReadyState(payload) {
  if (payload.userType != null) {
    let io = global.io;
    if (io != null) {
      let type = payload.userType.toLowerCase();
      let ROOMS = SOCKET_ROOMS.filter((v) => type == v.toLowerCase()).map(
        (v) => `${v}`
      );
      if (ROOMS.length == 1) {
        return { io: io, room: ROOMS[0].toLowerCase() };
      }
    }
  }
  return false;
}

exports.onAdminLogin = (payload) => {
    let result = isReadyState(payload);
    if (result != false) {
      result.io.in(result.room).emit(events.ON_ADMIN_LOGIN, payload);
    }
  };