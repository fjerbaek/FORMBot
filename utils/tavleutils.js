const channelUtils = require('../utils/channelutils');
const fs = require('fs');
const config = require('../config.json');
let tavlen = require('../tavlen.json');


module.exports = {
	getPotens: getPotens,
	getNavn: getNavn,
	print: print,
	påAfTavlen: påAfTavlen,
	tavlegrund: tavlegrund,
	findPerson: findPerson,
	add: add,
	remove: remove,
	update: update
}

function getPotens(navn){
	navn = navn.toLowerCase();
	return tavlen[navn]? tavlen[navn][1] : 0;
}

function getNavn(message){
	return message.member.displayName;
}

function print(channel){
	let msg = "";
	Object.keys(tavlen).forEach(person => {
		if (getPotens(person) > 0){
			msg += tavlen[person][0];
			msg += (getPotens(person) > 1) ? "^" + getPotens(person) + "\n" : ",  ";
		}
	})
	channelUtils.sendMessage(channel, msg);
}

function add(person){
	tavlen[person.toLowerCase()] = [person, getPotens(person) + 1];
}

function remove(person){
	tavlen[person.toLowerCase()] = [person, getPotens(person) - 1];
}

function påAfTavlen(message, delta){
	const client = message.client;
	const navn = message.author.username.toLowerCase();
	console.log(navn + " er kommet på tavlen - Tjek det lige");
		tavlen[navn] = [getNavn(message), getPotens(navn) + delta];
	update(client)

}

function update(client){
	fs.writeFileSync("./tavlen.json", JSON.stringify(tavlen))
	client.channels.fetch(config.tavleid)
		.then(channel => {
			channelUtils.clear(channel, 100);
			print(channel);
		});
}

function tavlegrund(message, reason){
	const channel = message.channel;
	const name = getNavn(message);
        console.log("Got here")
	påAfTavlen(message, 1);
	channelUtils.sendMessage(channel, "**" + name + " på tavlen!**\n Grund: " + reason);
}

function findPerson(displayname){
	ret = [];
	Object.keys(tavlen).forEach(obj => {
		if (obj.toLowerCase() === displayname.toLowerCase() || tavlen[obj][0].toLowerCase() === displayname.toLowerCase()){
			ret.push(obj)
		}
	})
	return ret;
}
