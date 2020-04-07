const channelUtils = require('../utils/channelutils.js');
const skilteUtils = require('../utils/skilteutils.js');
const {kammerid} = require('../config.json');
module.exports = {
    name: 'skiltet',
    hidden: 'true',
    description: 'Viser om Skiltet Der Skal Kunne Falde Ned kan falde ned. Gives [ned], vælter du skiltet. Gives [op] sætter du skiltet på plads igen.',
    usage: '[ned|op]',
    execute(message, args) {
        const channel = message.channel;
        if (!(message.channel.id === kammerid)){
            channelUtils.reply(message, " du skal være på kammeret for at kunne interagere med Skiltet")
        }
        if (!args[0]){
            skilteUtils.print(channel);
        } else if (args[0] === "ned") {
            skilteUtils.ned(message);
        } else if (args[0] === "op") {
            skilteUtils.op(message);
        }
    }
};
