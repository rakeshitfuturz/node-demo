//Maintain this json, for easy access to models anywhere in the app.
module.exports = {
    admin: require('./admins'),
    rider: require('./riders'),
    customer: require('./customers'),
    order: require('./orders'),
    orderTracking: require('./orderTracking'),
    attendence: require('./attendence')
}