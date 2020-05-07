const{voiceid} = require('../config.json')
module.exports = {
    playOnID : playOnID,
    muteall : muteall,
    mute : mute,
    play : play,
    stop : stop
}

async function play(voiceConnection, path){
    if (voiceConnection && path) voiceConnection.play(path);
}

async function stop(voiceConnection){
    if (voiceConnection) voiceConnection.play("./sound/silence.mp3");
    console.log("test")
}

function playOnID(client, id, path) {client.channels.fetch(id).then(channel => playSound(channel, path))};

function muteall(message, id, isMute) {message.client.channels.fetch(id).then(channel => muteeveryone(channel, isMute))};

function mute(message, id, muteid, isMute) {message.client.channels.fetch(id).then(channel => mutespecific(channel, muteid, isMute))};

async function muteeveryone(channel, isMute){
    channel.members.each(member => member.voice.setMute(isMute, "FORM siger det"));
}

async function mutespecific(channel, id, isMute){
    channel.members.filter(member => (member.id === id)).first().voice.setMute(isMute, "FORM siger det");	
}

async function joinChannel(channel){
    connection = await channel.join();

}
async function playSound(channel, path){
    connection = await channel.join();	
    console.log("playing sound");
    if (path) {
        connection.play(path);
    }
}
