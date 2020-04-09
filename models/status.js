const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({
    _id : String,
    status : {}
});

module.exports = mongoose.model("Status", statusSchema);
