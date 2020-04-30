const {kammerid} = require('../config.json');
module.exports = {
    clear:function(channel, messages) {
        channel.bulkDelete(messages)	
    },
    sendMessage:sendMessage,
    reply:reply,
    dm:dm,
    mention:mention,
    sendMention:sendMentionMessage,
}

function reply(message, reply){
    reply = sanitize(message.channel, reply);
    message.reply(reply);
}

function sendMessage(channel, message){
    message = message.toString();
    message = sanitize(channel, message)
    channel.send(message);
}

function dm(message, privateText, publicText){
    publicText = sanitize(message.channel, publicText);
    message.author.send(privateText, {split: true}).then(() => {
        if (message.channel.type === 'dm') return;
        console.log("Got here: " + publicText);
        message.reply(publicText);
    }).catch(error => {
        console.error("Kunne ikke sende DM til " + message.author.tag + '\n', error)
        message.reply("Jeg kan ikke sende dig en DM - Har du dem deaktiveret?");

    })
}

//Makes TÅGEKAMMERET uppercase, and replaces sigmas by S if on #Kammeret
function sanitize(channel, text){
    text = text.replace(/T(Å|AA)GEKAMMER/i, "TÅGEKAMMER");
    if (channel.id === kammerid){
        text = text.replace(/(Σ|∑|𝚺|𝛴|𝜮|𝞢|⅀)/,"S");
    }
    return text;
}

function mention(id) {
    return "<@" + id + ">";
}

function sendMentionMessage(channel, id, message) {
    sendMessage(channel, mention(id) + message);
}
