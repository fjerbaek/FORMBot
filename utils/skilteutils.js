const channelUtils = require('../utils/channelutils.js');
const tavleUtils = require('../utils/tavleutils.js')
const fs = require('fs');
const config = require('../config.json');
let skiltet = require('../skilt.json');


module.exports = {
	print: print,
	ned: ned,
	op: op,
	getStatus : getStatus
}

function print(channel){
	let msg = "";
	isAbleToFallDown = skiltet.status;
	if (isAbleToFallDown) {
		msg ="Skiltet kan godt falde ned!"
	} else {
		msg = "Skiltet kan ikke falde ned, og skal fixes.\n Den sidste der hærgede skiltet er: " + skiltet.last;
	}
	channelUtils.sendMessage(channel, msg);
}

function ned(message){
	skiltet.status = false;
	skiltet.last = message.author.username;
        tavleUtils.tavlegrund(message, "Du har hærget skiltet.")
	save();
}

function op(message){
	if (!skiltet.status) {
		skiltet.status = true;
		skiltet.last = "";
		channelUtils.reply(message, "du sætter skiltet op, så det igen kan falde ned.")
		save();
	} else {
		channelUtils.reply(message, "skiltet er allerede på sin plads.")
	}
}

function getStatus(){
	return skiltet.status;
}

function save(){
	fs.writeFileSync("./skilt.json", JSON.stringify(skiltet))
}
