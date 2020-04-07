const channelUtils = require('../utils/channelutils.js');
const diskoUtils = require('../utils/diskoutils.js')
module.exports = {
    name: 'disko',
    description: 'Viser {--ΔIΣKΟKYΛEN--}. Tilføj \'add <klandret> <klandrer>\' for at tilføje en klandringen <klandret>(<klandrer>), og \'remove <klandret> <klandrer>\' for at fjerne en klandring. Gives <klandrer> ikke, anvendes dit eget nickname',
    usage: '[(add|remove) <klandret> [<klandrer>]]',
    aliases: ['d','diskokylen'],
    execute(message, args) {
        const channel = message.channel;
        if (args.length === 0){
            return diskoUtils.print(channel);
        } else if (args.length > 1){
            const klandret = args[1];
            const klandrer = args[2]? args[2] : message.member.displayName;
            if (args[0]==="add"){
                addKlandring(message, klandrer, klandret)
            } else if (args[0]==="remove"){
                removeKlandring(message, klandrer, klandret);
            } else {
                channelUtils.reply(message, "første parameter skal være 'add' eller 'remove'");
            }
        } else {
            channelUtils.reply(channel, "forkerte parametre givet.");
        }
    },
};

function addKlandring(message, klandrer, klandret){
    diskoUtils.add(klandrer, klandret);
    channelUtils.reply(message, "klandring tilføjet!");
    diskoUtils.update(message.client);
}

function removeKlandring(message, klandrer, klandret){
    const remove = diskoUtils.remove(klandrer, klandret);
    if (!remove){
        return channelUtils.reply(message,"klandringen du prøver at fjerne eksisterer ikke.");
    } else {
        channelUtils.reply(message, "klandring fjernet!");
    }
    diskoUtils.update(message.client);
}
