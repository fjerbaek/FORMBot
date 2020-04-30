const channelUtils = require('../utils/channelutils.js');
const tavleUtils = require('../utils/tavleutils.js')
const fs = require('fs');
const config = require('../config.json');
const dbHandler = require('../utils/dbhandler.js')
const Wallet = require('../models/wallet.js');
const Status = require('../models/status.js') 

module.exports = {
    print: print,
    generateCard: generateCard,
    sendById: sendById,
    sendNew: sendNew,
    useCard: useCard
}

async function getWallet(id){
    let wallet = await dbHandler.findOne(Wallet, {"_id":id});
    if (!wallet) {
        wallet = await dbHandler.insertOne(Wallet, {"_id":id, "cards":[]}).then("New wallet created")
    }
    console.log(wallet)
    return wallet;
}

async function print(message){ 
    const wallet = await getWallet(message.author.id).catch(() => dbError());
    if (!wallet.cards.length) {
        channelUtils.dm(message, "Du har ingen bundekort", "Jeg har sendt dig en DM med info om dine bundekort"); //TODO: Send i DM.
    } else {
        channelUtils.dm(message, listCards(wallet), "Jeg har sendt dig en DM med info om dine bundekort");
    }
}

function listCards(wallet){
    let msg = "";
    wallet.cards.forEach(bundekort => {
        msg += "ID: " + bundekort._id + "\n";
        msg += "Fra " + channelUtils.mention(bundekort.authorid) + ":\n";
        msg += bundekort.text + "\n\n";
    })
    return msg
}

async function generateCard(message, text){
    const wallet = await getWallet(message.author.id).catch(() => dbError());
    const id = await getNewId();
    if (wallet && id){
        const bundekort = {"_id": id, "authorid":message.author.id, "text":text };
        await addCard(bundekort, message.author.id);
        channelUtils.reply(message, "Bundekort er genereret!");
        return true;
    } else {
        channelUtils.reply(message, "Kunne ikke generere bundekort");
    }
}

//async function removeCard(message, id){}
async function addCard(card, id){
    dbHandler.updateOne(Wallet, {"_id":id}, {"$push":{"cards":card}}, upsert=true);
}

async function removeCard(card, id){
    dbHandler.updateOne(Wallet, {"_id":id}, {"$pull":{"cards":card}});
}

async function sendNew(message, recipient, text){
    const id = await getNewId();
    const bundekort = {"_id":id, "authorid":message.author.id, "text":text};
    console.log("Bundekort: " + bundekort)
    addCard(bundekort, recipient);
    channelUtils.reply(message, "Bundekortet (id: " + bundekort._id + ")er sendt!")
}

async function useCard(message, id){
    console.log("test")
    const card = await getCardById(message.author.id, id);
    if (!card){
        return channelUtils.reply(message, "Du har ikke pågældende bundekort")
    } else {
        const recipient = card.authorid;
        const filter = (msg) => (msg.author.id === recipient && (msg.content.toLowerCase().replace(/ /g,'') === "!bundekortok"+card._id || msg.content.toLowerCase().replace(/ /g, '') === "!bkok"+card._id));
        const collector = message.channel.createMessageCollector(filter, { time: 300000 });
        collector.on('collect', m => {
            removeCard(card, message.author.id);
            channelUtils.reply(message, "Bundekortet med id " + card._id + " er nu brugt!");
            collector.stop();
        });
        channelUtils.sendMention(message.channel, recipient, " - Du modtager et bundekort med teksten:\n" + card.text + "\n Underskrevet: " + channelsUtils.mention(card.authorid) + "\n Send \"!bundekort ok " + card._id + "\" inden for 5 minutter for at acceptere.")
    }
}

async function getNewId(){
    const maxval = await dbHandler.findOneAndUpdate(Status, {"_id":"maxcardid"}, {$inc:{"status.val":1}}, upsert=true); 
    return maxval.status.val;

}

async function getCardById(walletid, cardid){
    const query = await dbHandler.findOne(Wallet, {"_id" : walletid, "cards":{$elemMatch : {"_id":cardid}}}, {"_id":0, "cards":{$elemMatch: {"_id":cardid}}});
    console.log(query)
    return query.cards[0]
}

async function sendById(message, recipient, cardid){
    const card = await getCardById(message.author.id, cardid) 
    if (!card){
        message.reply(message, "Det angivne bundekort eksisterer ikke.")
    } else {
        removeCard(card, message.author.id);
        addCard(card, recipient);
        channelUtils.reply(message, "Bundekortet på " + channelUtils.mention(card.authorid) + " er blevet sendt!" )
    }
    console.log(card);
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

function dbError(){
    console.log("Error communicating with database.")
}
