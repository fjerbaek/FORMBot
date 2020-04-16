const channelUtils = require('../utils/channelutils.js');
const bundekortUtils = require('../utils/bundekortutils.js');
const {kammerid} = require('../config.json');
module.exports = {
    name: 'bundekort',
    aliases: ['bk'],
    description: 'Viser dig alle dine bundekort i din "pung".\nGives [use <id>] bruger du bundekortet med id <id>.\nGives [new <tekst>], opretter du et bundekort på dig selv med teksten <tekst>, der placeres i din egen pung.\nGives [send @user <id>] sendes bundekortet med id <id> til den taggede bruger.\nGives [sendnew @user <text>] sendes et nyt bundekort til den taggede bruger med teksten <tekst>\n gives [ok <id>]',
    //usage: '[(use|ok) <id> <(send @user (<id>| new <text>) | new <]',
    execute(message, args) {
        const channel = message.channel;
        console.log(args)
        if (args[0] === "new" && args[1]){
            bundekortUtils.generateCard(message, args.slice(1,args.length).join(" "));
        } else if (args[0] === "send" && args[1].match(/^<@!?(\d+)>$/) && parseInt(args[2])){
            const matches = args[1].match(/^<@!?(\d+)>$/);
            const recipient = matches[1];
            return bundekortUtils.sendById(message, recipient, args[2]);
        } else if (args[0] === "sendnew" && args[1].match(/^<@!?(\d+)>$/) && args[2]){
            const matches = args[1].match(/^<@!?(\d+)>$/);
            const recipient = matches[1];
            const text = args.slice(2, args.length).join(" ");
            return bundekortUtils.sendNew(message, recipient, text);
        } else if (args[0] === "use" && parseInt(args[1])){
            bundekortUtils.useCard(message, args[1])
        } else if (!(args[0] === "ok")){
            bundekortUtils.print(message);
        }           
    }
};
