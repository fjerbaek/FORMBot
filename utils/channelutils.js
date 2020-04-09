const {kammerid} = require('../config.json');
module.exports = {
	clear:function(channel, messages) {
		channel.bulkDelete(messages)	
	},
	sendMessage:function(channel, message){
		message = message.toString();
		message = sanitize(channel, message)
		channel.send(message);
		
	},
	reply:function(message, reply){
		reply = sanitize(message.channel, reply);
		message.reply(reply);
	}
}

//Makes TÅGEKAMMERET uppercase, and replaces sigmas by S if on #Kammeret
function sanitize(channel, text){
	text = text.replace(/T(Å|AA)GEKAMMER/i, "TÅGEKAMMER");
	if (channel.id === kammerid){
		text = text.replace(/(Σ|∑|𝚺|𝛴|𝜮|𝞢|⅀)/,"S");
	}
	return text;
}


