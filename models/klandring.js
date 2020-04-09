const mongoose = require('mongoose');

const klandringSchema = mongoose.Schema({
    klandret: String,
    klandrer : String,
    potens: Number
     
});

module.exports = mongoose.model("Klandring", klandringSchema);
