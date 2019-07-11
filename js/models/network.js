var mongoose = require('mongoose');

var NetworkSchema = new mongoose.Schema({
    dnserver: String,
    gateway: String,
    hostname: String,
    ipaddress: String,
    networkdhcp: Boolean,
    subnetmask: String
});

module.exports = mongoose.model('Network', NetworkSchema);
