const channelUtils = require('../utils/channelutils.js');
const skraldeUtils = require('../utils/skraldeutils.js');
const {skraldeid, kammerid} = require('../config.json');
module.exports = {
    name: 'skraldespanden',
    description: 'Viser hvor fyldt skraldespanden er. Gives [tøm], tømmer du skraldespanden.',
    usage: ' [tøm]',
    aliases: ['s'],
    execute(message, args) {
        const channel = message.channel;
        if (!(message.channel.id === skraldeid || message.channel.id === kammerid)){
            return channelUtils.reply(message, " du skal være på #kammeret eller #forms-brevkasse  at kunne interagere med skraldespanden")
        }
        if (!args[0]){
            skraldeUtils.print(channel);
        } else if (args[0] === "tøm") {
            skraldeUtils.empty(message.client);
        }
    }
};
