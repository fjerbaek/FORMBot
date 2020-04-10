const channelUtils = require('../utils/channelutils.js');
const tavleUtils = require('../utils/tavleutils.js')
module.exports = {
    name: 'tavlen',
    description: 'Viser omgangsskyldnerfeltet. Hvis [navn] er givet, vises det hvorvidt pågældende person er på tavlen eller ej',
    usage: '[navn]',
    aliases: ['t'],
    async execute(message, args) {
        const channel = message.channel;
        //Check tagged user or check user by alias.
        if (args.length === 1) {
            if (message.mentions.users.size) {
                tavleUtils.printById(message, message.mentions.users.first().id)
            } else { 
                tavleUtils.printByAlias(message, args[0])
            }
            //Let BEST add and remove people:
            //TODO: Create Merge function, that allows merging two entries where one has an actual id.
        } else if (args.length === 2 && message.member.roles.cache.some(role => role.name === "BEST")){
            let id;
            let name = args[0];
            if (message.mentions.users.size){
                id = message.mentions.users.first().id;
                name = message.mentions.members.first().displayName;
            } else {

                //Check if non-tagged name is alias for another id
                id = await tavleUtils.idFromAlias(args[0]);

            }
            if (parseInt(args[1])){
                tavleUtils.påAfTavlen(message.client, id, args[1], name)
                channelUtils.sendMessage(channel, "Ændring registeret")
            } 
        }

        else {

            channelUtils.sendMessage(channel, "Se #omgangsskyldnerfeltet for aktuel tavlestatus")
        }


    }
};
