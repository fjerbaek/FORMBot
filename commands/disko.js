const channelUtils = require('../utils/channelutils.js');
const diskoUtils = require('../utils/diskoutils.js')
module.exports = {
    name: 'disko',
    description: 'Viser {--ΔIΣKΟKYΛEN--}. Tilføj \'add <klandret> <klandrer>\' for at tilføje en klandringen <klandret>(<klandrer>), og \'remove <klandret> <klandrer>\' for at fjerne en klandring. Gives <klandrer> ikke, anvendes dit eget nickname',
    usage: '[(add|remove) <klandret> [<klandrer>]]',
    aliases: ['d','diskokylen'],
    async execute(message, args) {
        const channel = message.channel;
        if (args.length === 0){
            return diskoUtils.print(channel);
        } else if (args.length > 1){
            const klandret = args[1];
            //If no third argument given, assume klandrer is sender of messages.
            const klandrer = args[2]? args[2] : "<@" + message.author.id + ">";

            if (args[0]==="add"){
                diskoUtils.addRemoveKlandring(message, klandrer, klandret, 1);
            } else if (args[0]==="remove"){
                diskoUtils.addRemoveKlandring(message, klandrer, klandret, -1);
            } else {
                channelUtils.reply(message, "første parameter skal være 'add' eller 'remove'");
            }
        } else {
            channelUtils.reply(channel, "forkerte parametre givet.");
        }
    },
};

