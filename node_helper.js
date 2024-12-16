/* MagicMirror²
 * Node Helper: MMM-SnowEffect
 * By Christian Gillinger
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },
    
    socketNotificationReceived: function(notification, payload) {
        // Currently not used, but included for future expansion
    }
});