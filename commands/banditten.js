const channelUtils = require('../utils/channelutils.js');
const soundUtils = require('../utils/soundutils.js');
const {voiceid, kammerid, formid} = require('../config.json');
module.exports = {
    name: 'banditten',
    aliases: ['b'],
    description: 'Ryk i banditten!',
    execute(message, args) {
        if(!(message.channel.id === kammerid)){
            return channelUtils.reply(message, "du kan altså kun rykke i banditten på #kammeret");
        } else {
            pullBandit(message)
        }
    }
};

function pullBandit(message){
    soundUtils.play(message.client.voiceconnection, "./sound/banditten.mp3");
    channelUtils.sendMessage(message.channel, message.member.displayName + " rykkede i banditten")
}

