const channelUtils = require('../utils/channelutils.js');
const tavleUtils = require('../utils/tavleutils.js')
module.exports = {
    name: 'tavlen',
    description: 'Viser omgangsskyldnerfeltet. Hvis [navn] er givet, vises det hvorvidt pågældende person er på tavlen eller ej',
    usage: '[navn]',
    aliases: ['t'],
    execute(message, args) {
        const channel = message.channel;
        if (args.length === 1) {
            persons = tavleUtils.findPerson(args[0]);
            if (persons.length != 0){
                persons.forEach(username =>{
                    let potens = tavleUtils.getPotens(username);
                    channelUtils.sendMessage(channel, args[0]+ " er på tavlen i " + potens + ". potens!");
                } )
            } else {
                channelUtils.sendMessage(channel, args[0] + " er ikke på tavlen.");
            }
        } else if (args.length === 2 && message.member.roles.cache.some(role => role.name === "BEST")){
            let person = args[1];
            if (message.mentions.users.size){
                let person = message.mentions.users.first().username;
            }	

            if (args[0] ===	"add"){
                tavleUtils.add(person);
            } else if (args[0] === "remove"){
                tavleUtils.remove(person);
            }
            tavleUtils.update(message.client);
        } else {
            tavleUtils.print(channel);
        }	
    },
};
