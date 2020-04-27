const channelUtils = require('../utils/channelutils.js');
const soundUtils = require('../utils/soundutils.js');
const {voiceid, kammerid, formid} = require('../config.json');
module.exports = {
    name: 'klokken',
    usage: 'ring',
    description: 'Ring med klokken!',
    args: true,
    execute(message, args) {
        if(!(message.channel.id === kammerid)){
            return channelUtils.reply(message, "du kan altså kun ringe med klokken på #kammeret");
        }
        if(args[0] === "ring"){
            ringKlokke(message)
        }
    }
};

function ringKlokke(message){
    soundUtils.play(message.client.voiceconnection, "./sound/klokke.mp3");
    channelUtils.sendMention(message.channel, message.member.id, " ringede med klokken!")
}

