const channelUtils = require('../utils/channelutils.js');
const config = require('../config.json');
const dbHandler = require('../utils/dbhandler.js')
const Status = require('../models/status.js');
const capacity = 2500;

module.exports = {
    print: print,
    isFull: isFull,
    sendToFORM: sendToFORM,
    empty: empty,
    kapselHit: kapselHit
}

async function print(channel){ 
    let skraldespanden = await getSkraldespanden().catch(() => dbError());
    channelUtils.sendMessage(channel, "Skraldespanden er " + Math.min(100,skraldespanden.status.filledAmount * 100 / capacity) + "% fyldt.");
    
}

async function isFull(){
    const skraldespanden = await getSkraldespanden().catch(() => dbError());
    return (skraldespanden.status.filledAmount >= capacity)
}

async function getSkraldespanden(){
    const skraldespanden = await dbHandler.findOne(Status, {"_id":"skraldespanden"}).catch(() => dbError());
    return skraldespanden;
}

async function kapselHit(){
    const skraldespanden = await getSkraldespanden().catch(() => dbError());
    dbHandler.updateOne(Status, skraldespanden, {$inc : {"status.filledAmount": 100}}).catch(() => dbError());
}

async function sendToFORM(message){
    const skraldespanden = await getSkraldespanden().catch(() => dbError());
    const size = await calculateSize(message);
    dbHandler.updateOne(Status, skraldespanden, {$inc : {"status.filledAmount": size}}).catch(() => dbError());
        if (await isFull()){
            channelUtils.sendMessage(message.channel, "SKRALDESPANDEN ER NU FULD OG SKAL TØMMES")
        }

}

async function calculateSize(message){

    return message.content.length + 100*message.attachments.size + 100*message.embeds.length
}

async function empty(client){
    client.channels.fetch(config.skraldeid).then(channel => {
            channelUtils.clear(channel, 100);
    })
    const skraldespanden = await getSkraldespanden().catch(() => dbError());
    dbHandler.updateOne(Status, skraldespanden, {$set : {"status.filledAmount": 0}});
}

function dbError(){
    console.log("Error communicating with status database.")
}
