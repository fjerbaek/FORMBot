const mongoose = require('mongoose');

const bundekortSchema = mongoose.Schema({
    _id : Number,
    authorid: String,
    text: String
});

const walletSchema = mongoose.Schema({
    _id : String,
    cards : [bundekortSchema]
});

module.exports = mongoose.model("Wallet", walletSchema);
