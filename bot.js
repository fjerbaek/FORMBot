const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token, tavleid, voiceid, dbURL, dbPort} = require('./config.json');
const channelUtils = require('./utils/channelutils.js');
const tavleUtils = require('./utils/tavleutils.js');
const soundUtils = require('./utils/soundutils.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

//const mongoose = require("mongoose");
//client.dbConnection = await mongoose.connect('mongodb://' + dbURL + ':' + dbPort + '/' + dbName);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require('./commands/'+file);
    client.commands.set(command.name, command);
}



client.once('ready', () => {
    connectToVoice()
        .then(() => console.log("Successfully connected to voice channel"))
        .catch("Error connecting to voice channel");
    
    console.log('Ready for commands.');
});

client.login(token);

client.on('message', message => {
    ruleCheck(message);

    //break early if not a command or message is from a bot.
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const channel = message.channel;

    //matches commandname with name of commands or their aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    //break early if user does not have rights. TODO: Generaliser til forskellige roller.
    if (command.bestonly && !message.member.roles.cache.some(role => role.name === "BEST")){

        channelUtils.reply(message, "du har ikke rettigheder til at anvende denne kommando");
    }

    //If command must have arguments, enforce it:
    if (command.args && !args.length) {
        let reply = "du mangler at angive et argument.";

        if (command.usage) {
            reply += "\nKorrekt brug er: " + prefix + command.name + " " + command.usage;
        }
        return message.reply(reply);
    }


    //Manage cooldowns:

    //If command not in cooldown collectoin, add it.
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);

    //set default cooldown of 1 second.
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return channelUtils.reply(message,"vent "+ timeLeft.toFixed(1) + " sekunder mere før du anvender " + command.name + " kommandoen");
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //Execute matched command
    try{
        command.execute(message,args);
    } catch (error) {
        console.error(error);
        channelUtils.reply(message, "kommandoen eksisterer ikke")

    }
});

async function connectToVoice(){
    const voicechannel = await client.channels.fetch(voiceid)
        .catch(() => console.log("Could not fetch voice channel"));
    client.voiceconnection = await voicechannel.join()
        .catch(() => console.log("Could not connect to voice channel"));

}

// Checks if any rule has been broken.
// Current rules:
//   No Σ's in #kammeret
//   TÅGEKAMMERET must be all caps.
function ruleCheck(message){
    const sigma = (message.content.match(/(Σ|∑|𝚺|𝛴|𝜮|𝞢|⅀)/) && message.channel.name === "kammeret");
    const tksmåt = /T(AA|Å)GEKAMMERET/i.test(message.content) && 
        !(/T(AA|Å)GEKAMMERET/.test(message.content)) ;
    if(sigma){	
        tavleUtils.tavlegrund(message, "Stort sigma på #kammeret");
    }
    if(tksmåt){
        tavleUtils.tavlegrund(message, "TÅGEKAMMERET skal skrives med lutter versaler");
    }
}

