const channelUtils = require('../utils/channelutils.js');
const soundUtils = require('../utils/soundutils.js');
const {voiceid, kammerid, formid} = require('../config.json');
module.exports = {
    name: 'p',
    description: 'P = NP',
    execute(message, args) {
            channelUtils.reply(message, "Mente du '!p'?")
    }
};

