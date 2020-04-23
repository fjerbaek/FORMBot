const channelUtils = require('../utils/channelutils.js');
const soundUtils = require('../utils/soundutils.js');
const {voiceid} = require('../config.json');
module.exports = {
    name: 'holdkæft',
    hidden: true,
    args: true,
    bestonly : true,
    description: 'mutes all members of voice channel',
    execute(message, args) {
        if (args[0] === "all") {
            soundUtils.muteall(message, voiceid, true);	
        } else if (message.mentions.users.size) {
            let mutee = message.mentions.users.first().id;
            soundUtils.mute(message,voiceid, mutee, true);
        }
    }
};
