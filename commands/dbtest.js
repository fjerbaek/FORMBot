const channelUtils = require('../utils/channelutils.js');
const dbHandler = require('../utils/dbhandler.js')
const {voiceid, kammerid, formid} = require('../config.json');
const TavleEntry = require('../models/tavlen.js')

module.exports = {
    name: 'dbtest',
    usage: '',
    description: 'Prints test ok if successfully connected to db.',
    execute(message, args) {
        if(args[0] === "insert"){
            const tavleEntry = new TavleEntry({
                uid: "test1234",
                aliases: ["testsen2"],
                potens: 2
            });
            dbHandler.insert(tavleEntry);
        } else { 
            console.log("blab");
        }
    }
};

