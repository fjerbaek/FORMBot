const channelUtils = require('../utils/channelutils');
const fs = require('fs');
const config = require('../config.json');
const dbHandler = require('../utils/dbhandler');
const Klandring = require('../models/klandring.js');

module.exports = {
    print: print,
    addRemoveKlandring: addRemoveKlandring,
    update: update
.js}

function superscript(n) {
    const s = n.toString();
    const digits = '⁰¹²³⁴⁵⁶⁷⁸⁹';

    var res = '';
    for (let i = 0; i < s.length; i++) {
        res += digits[s[i]];
    }

    return res;
}

//Prints content of diskokylen
async function print(channel){
    const klandringer = await getKlandringer(); 
    let msg = "";
    klandringer.forEach(klandring => {
        msg += klandring.klandret + "(" + klandring.klandrer + ")";
        msg += (klandring.potens > 1) ? superscript(klandring.potens) + "\t": "\t";
    })
    if(msg){
        channelUtils.sendMessage(channel, msg)
    } else {
        channelUtils.sendMessage(channel, "Der er ingen klandringer.")
    }
}

//Fetches all klandringer from db.
async function getKlandringer(){
    const klandringer = await dbHandler.find(Klandring, {}).catch(err => dbError())
    return klandringer;
}

//Returns klandring on <klandret> by <klandrer>. Case insensitive.
async function getKlandring(klandrer, klandret){
    const regKlandrer = new RegExp("^" + klandrer + "$","i");
    const regKlandret = new RegExp("^" + klandret + "$","i");
    return await dbHandler.findOne(Klandring, {"klandrer": regKlandrer, "klandret":regKlandret})
        .catch(err => console.log(err));
}

//Adds (or removes) <delta> klandringer on <klandret> by <klandrer>. 
async function addRemoveKlandring(message, klandrer, klandret, delta){
    const klandring = await getKlandring(klandrer, klandret).catch((err) => console.log("Huh?" + err));

    //If klandring already exists, and we now get an exponent below 1, then delete it.
    if (klandring && (parseInt(klandring.potens) + parseInt(delta)) < 1) {
        await dbHandler.deleteOne(Klandring, klandring);
    }

    //Otherwise update or insert
    else if (klandring) {
        await dbHandler.updateOne(Klandring, {"klandrer":klandrer, "klandret": klandret}, {$inc : {potens: delta}});
    } else if (delta > 0){
        await dbHandler.insertOne(Klandring, {"klandrer":klandrer, "klandret": klandret, potens: delta});
    } else {
        //Klandring to remove didnt exist
        channelUtils.reply(message, "Klandringen eksisterer ikke");;
    }
    channelUtils.reply(message, "Ændring registreret")
    //Update relevant channels:
    update(message.client);
}

function update(client){
    client.channels.fetch(config.diskoid)
        .then(channel => {
            channelUtils.clear(channel, 100);
            print(channel);
        }).catch(() => console.log("Could not update diskokylen"));
}

function dbError(){
    console.log("Error communicating with klandring db")
}
