const mongoose = require('mongoose');

const tavleEntrySchema = mongoose.Schema({
    _id : String,
    alias : String,
    potens: Number
});

module.exports = mongoose.model("TavleEntry", tavleEntrySchema);
