const channelUtils = require('../utils/channelutils.js');
const soundUtils = require('../utils/soundutils.js');
const {voiceid, kammerid, formid} = require('../config.json');
module.exports = {
    name: 'pb',
    description: 'Start en pædagogisk bundecirkel!',
    bestonly: true,
    hidden: true,
    execute(message, args) {
        if(!(message.channel.id === kammerid)){
            return channelUtils.reply(message, "Vi kører PB på #kammeret. Ikke udenfor!");
        }else{
            startPb(message)
        }
    }
};

function startPb(message){
    soundUtils.play(message.client.voiceconnection, "./sound/pb.mp3");
    channelUtils.sendMessage(message.channel, message.member.displayName + " startede en pædagogisk bundecirkel!")
}

