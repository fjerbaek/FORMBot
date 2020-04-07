const channelUtils = require('../utils/channelutils');
const fs = require('fs');
const config = require('../config.json');
let disko = require('../disko.json');



module.exports = {
	print: print,
	add: add,
	remove: remove,
	update: update
}


function print(channel){
	let msg = "";
	klandringer = disko.klandringer;
	for (klandring in klandringer){
		msg += klandringer[klandring].klandret + "(" + klandringer[klandring].klandrer + ")";
		msg += (klandringer[klandring].potens > 1) ? "^"+klandringer[klandring].potens : "";
		msg += "\n"
	}
	channelUtils.sendMessage(channel, msg);
}

function add(klandrer, klandret){
	duplicate = false;
	disko.klandringer.forEach(klandring => {
		if(klandring.klandrer.toLowerCase() === klandrer.toLowerCase() && klandring.klandret.toLowerCase() === klandret.toLowerCase()){
			klandring.potens += 1;
			duplicate = true;
		}
	});
	if (!duplicate){
		disko.klandringer.push({"klandrer":klandrer, "klandret":klandret, "potens":1});
	}
	fs.writeFileSync("./disko.json", JSON.stringify(disko))
}

function remove(klandrer, klandret){
	exists = false;
	disko.klandringer.forEach(klandring => {
	if(klandring.klandrer.toLowerCase() === klandrer.toLowerCase() && klandring.klandret.toLowerCase() === klandret.toLowerCase()){
			if (klandring.potens > 1){
				klandring.potens -= 1;
			} else {
				index = disko.klandringer.indexOf(klandring);
				if(index > -1){
					disko.klandringer.splice(index, 1);
				}
			}
			exists = true;
		}

	});
	return exists;
}

//function påAfTavlen(navn, delta, client){
	//console.log(navn + " er kommet på tavlen - Tjek det lige.");
		//tavlen[navn] = [getNavn(navn), getPotens(navn) + delta];
	//fs.writeFileSync("./tavlen.json", JSON.stringify(tavlen))
	//update(client)

//}

function update(client){
	client.channels.fetch(config.diskoid)
		.then(channel => {
			channelUtils.clear(channel, 100);
			print(channel);
		});
}
