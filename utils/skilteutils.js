const channelUtils = require('../utils/channelutils.js');
const tavleUtils = require('../utils/tavleutils.js')
const fs = require('fs');
const config = require('../config.json');
const dbHandler = require('../utils/dbhandler.js')
const Status = require('../models/status.js');

module.exports = {
    print: print,
    ned: ned,
    op: op,
    isUp: isUp,
}

async function print(channel){ 
    let skiltet = await getSkiltet().catch(() => dbError());
    if (skiltet.status.isUp) {
        channelUtils.sendMessage(channel, "Skiltet kan godt falde ned!")
    } else {
        channelUtils.sendMessage(channel, "Skiltet kan ikke falde ned, og skal fixes.\n - Den sidste der hærgede skiltet er: " + skiltet.status.lastDown)
    }
}

async function isUp(){
    const skiltet = await getSkiltet().catch(() => dbError());
    return skiltet.status.isUp;
}

async function getSkiltet(){
    const skiltet = await dbHandler.findOne(Status, {"_id":"skiltet"})
        .catch(() => dbError());
    return skiltet;
}

async function ned(message){
    const skiltet = await getSkiltet()
        .catch(() => dbError());
    if (!skiltet.status.isUp) {
        channelUtils.reply("Skiltet er faldet ned i forvejen");
    } else {
        dbHandler.updateOne(Status, {"_id":"skiltet"}, {"status.isUp":false, "status.lastDown":channelUtils.mention(message.member.id)})
            .catch(() => dbError());
        return tavleUtils.tavlegrund(message, "Du har hærget skiltet.");
    }
}

async function op(message){
    const skiltet = await getSkiltet()
        .catch(() => dbError());
    if (skiltet.status.isUp) {
        channelUtils.reply(message, " skiltet er allerede på sin plads.");
    } else {
        dbHandler.updateOne(Status, {"_id":"skiltet"}, {"status.isUp":true, "lastDown":""})
            .catch(() => dbError());
        channelUtils.reply(message, " du hænger skiltet på plads igen.");
    }
}

function dbError(){
    console.log("Error communicating with database.")
}
