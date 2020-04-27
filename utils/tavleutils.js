const channelUtils = require('../utils/channelutils');
const fs = require('fs');
const config = require('../config.json');
const dbHandler = require('../utils/dbhandler')
const TavleEntry = require('../models/tavlen.js')


module.exports = {
    print: print,
    påAfTavlen: påAfTavlen,
    tavlegrund: tavlegrund,
    update: update,
    idFromAlias: idFromAlias,
    printById: printById,
    printByAlias: printByAlias
}

//Prints content of omgangsskyldnerfeltet
async function print(channel){
    const tavleEntries = await getTavleEntries(); 
    let msg = "";
    tavleEntries.forEach(entry => {
        if (entry.potens > 0) {
            msg += entry.alias
            msg += (entry.potens > 1) ? "^" + entry.potens + "\t" : "\t";
        }
    })
    if(msg){
        channelUtils.sendMessage(channel, msg);
    } else {
        channelUtils.sendMessage(channel, "Der er ingen på tavlen.")
    }
}

//Changes id's entrance by <delta>. If it does not exist, it will be created.
async function påAfTavlen(client, id, delta, name=""){
    if(!name) name = id; //Defaults name to id if none given.
    const entry = await getById(id);
    
    //If the person already exists, and the exponent drops below 1, delete the entry.
    if (entry && (parseInt(entry.potens) + parseInt(delta)) < 1) {
        dbHandler.deleteOne(TavleEntry, entry);
    } 
    //Otherwise update/insert  
    else {
        dbHandler.updateOne(TavleEntry, {_id: id}, {$inc : {potens: delta}, $setOnInsert: {alias:name}}, upsert=true).catch(() => dbError()); 
    }
    //Update relevant channels
    update(client)
}

function update(client){
    client.channels.fetch(config.tavleid)
        .then(channel => {
            channelUtils.clear(channel, 100);
            print(channel);
        }).catch(() => console.log("Could not update #omgangsskyldnerfeltet"));
}

async function tavlegrund(message, reason){
    const id = message.author.id;
    const entry = await getById(id)
        .catch(() => dbError());
    const name = message.member.displayName;
    påAfTavlen(message.client, id, 1, name);
    channelUtils.sendMessage(message.channel, "**" + channelUtils.mention(id) + " på tavlen!**\n Grund: " + reason);
    console.log(name + " (" + id + ") er kommet på tavlen for " + reason);
}

async function getTavleEntries(){
    return await dbHandler.find(TavleEntry, {}).catch(() => dbError())
}

async function getById(id) {
    return await dbHandler.findOne(TavleEntry, {"_id":id}).catch(() => dbError());
};

async function getByAlias(alias) {
    const regAlias = new RegExp("^" + alias + "$", "i") //Make case insensitive match.
    const entries = await dbHandler.find(TavleEntry, {"alias":regAlias})
        .catch(() => dbError());
    return entries;
}

//Returns corresponding id to alias. If no such id exists, it returns alias.
async function idFromAlias(alias) {
    const id = await getByAlias(alias)
        .catch(() => dbError());
    return id.length ? id[0]._id : alias
}


async function printById(message, id){
    const entry = await getById(id).catch(() => dbError())
    if (entry){
        channelUtils.sendMessage(message.channel, entry.alias + " er på tavlen i " + entry.potens + ". potens.")
    } else {
        channelUtils.sendMessage(message.channel, channelUtils.mention(id) + " er ikke på tavlen.")
    }
}

async function printByAlias(message, alias){
    const entries = await getByAlias(alias).catch(() => dbError());
    let msg;
    if (!entries.length){
        msg = alias + " er ikke på tavlen";
    }  else if (entries.length == 1) {
        msg = entries[0].alias + " er på tavlen i " + entries[0].potens + ". potens.";
    } else {
        entries.forEach(entry => {
            msg += entry.alias + "(id: " + entry._id + ") er på tavlen i " + entry.potens + ". potens.\n"
        })
    } 
    channelUtils.sendMessage(message.channel, msg)
}

function dbError(){
    console.log("Error communicating with Tavleentry db.")
}
