module.exports = {
    name: 'deleteallfrom',
    description: 'Deletes messages from mentioned user',
    hidden: true,
    bestonly: true,
    execute(message, args) {
        const channel = message.channel;
        if(!message.mentions.users.size){
            return channelUtils.reply(message, "You need to tag a user!")
        }	
        const taggedUserId = message.mentions.users.first().id;
        del(message, args[1], taggedUserId);
    },
};

//Deletes all messages from the user with id <uid> including the phrase <phrase> in the channel in which the command was sent.

async function del(message, phrase, uid){
    const channel = message.channel;
    let fetched;
    let lastgotten = message.id; 
    do {
        //Fetches 100 messages (maximum allowed) starting from message with id lastgotten.
        fetched = await channel.messages.fetch({limit:100, before: lastgotten});
        lastgotten = fetched.last().id;
        await channel.bulkDelete(fetched.filter(m => m.author.id === uid && m.content.includes(phrase))).then(msgs => console.log("deleted " + msgs.size + "messages..."));

    }
    while(fetched.size >= 2);
}
