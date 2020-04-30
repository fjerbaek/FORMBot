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
    channelUtils.sendMention(message.channel, message.member.id, " startede en pædagogisk bundecirkel!")
}

