const channelUtils = require('../utils/channelutils.js');
const skilteUtils = require('../utils/skilteutils.js');
const soundUtils = require('../utils/soundutils.js');
const tavleUtils = require('../utils/tavleutils.js');
const skraldeUtils = require('../utils/skraldeutils.js');
const {voiceid, kammerid} = require('../config.json');
module.exports = {
    name: 'kapsel',
    usage: '(@<person>|klokken|jagtskoven|skiltet)',
    description: 'Kast en kapsel efter den taggede <person>, klokken, jagtskoven eller Skiltet, der skal kunne falde ned - sidstnævnte på eget ansvar!.',
    cooldown: 1,
    aliases: ['k'],
    args: true,
    async execute(message, args) {
        //Only allow throwing caps in #kammeret
        if(!(message.channel.id === kammerid)){
            return channelUtils.reply(message, "lad nu være at svine uden for #kammeret")
        }
        //Switch on different targets.
        switch(args[0]){
            case "klokken":
                if (isHit(0.4)) {
                    hitKlokke(message);		
                } else {miss(message)}
                break;
            case "jagtskoven":
                if (isHit(0.5)) {
                    hitJagtskoven(message);
                } else { miss(message) }
                break;
            case "skiltet":
                if (! await skilteUtils.isUp()){
                    channelUtils.reply(message, "Skiltet kan ikke falde ned og skal derfor først sættes op igen, før der kan kastes efter det. Se eventuelt \'!help skiltet\'.")
                    break;
                }
                if (isHit(0.6)){
                    hitSkiltet(message);	
                } else { miss(message) }
                break;	
            case "skraldespanden":
                if (isHit(0.7)) {
                    hitSkraldespanden(message);
                } else { miss(message) }
                break;
            default:  
                //If another person has been mentioned
                if(message.mentions.users.first()){
                    target = message.mentions.users.first().id;
                    if (isHit(0.7)){
                        hitPerson(target, message);
                    } else {
                        miss(message)
                    }
                }
                break;
        }

    }
};


function isHit(prob){
    return (Math.random() < prob);
}

function hitKlokke(message){
    channelUtils.reply(message, "du rammer klokken!")
    soundUtils.play(message.client.voiceconnection, "./sound/ding.mp3")
}

function miss(message){
    channelUtils.reply(message, "du rammer forbi...")
}

function hitJagtskoven(message){
    channelUtils.reply(message, "du rammer jagtskoven!")
    soundUtils.play(message.client.voiceconnection, "./sound/ding.mp3")
}

function hitSkiltet(message){
    msg = "du rammer skiltet..."
    if (isHit(0.2)){
        channelUtils.reply(message, "Det falder ned! HÆRG!");
        soundUtils.play(message.client.voiceconnection, "./sound/hærg.mp3");
        skilteUtils.ned(message);
    } else {
        channelUtils.reply(message, "Du rammer skiltet, men det falder ikke ned");

        soundUtils.play(message.client.voiceconnection, "./sound/skilthit.mp3")
    }
}

function hitSkraldespanden(message){
    skraldeUtils.isFull().then(isFull => {
        if (isFull){
            channelUtils.reply(message, "Du rammer skraldespanden, men da den er fyldt, falder kapslen på gulvet.")
        } else {
            channelUtils.reply(message, "Du rammer skraldespanden!");
            skraldeUtils.kapselHit()
        }
    soundUtils.play(message.client.voiceconnection, "./sound/trashcap.mp3")
    })
}

function hitPerson(target, message){
    channelUtils.sendMention(message.channel, message.author.id, " rammer " + channelUtils.mention(target) + " med en kapsel!");
    //If target is bot:
    if (target === message.client.user.id) {
        channelUtils.sendMessage(message.channel, "AAAAAAAAV!!!\n Høker!!!\n - bare gi' den til FORM!");	
    }
}


