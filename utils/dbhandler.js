const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/formbot', {useNewUrlParser:true, useUnifiedTopology:true}).then(() => console.log("Successfully connected to database")).catch(err => console.log(err));

module.exports = {
    find:find,
    findOne:findOne,
    updateOne:updateOne,
    deleteOne: deleteOne,
    insertOne: insertOne
}

//All queries are called with .exec() to make them return Promises.
//


async function find(model, filter={}, fields=""){
    return await model.find(filter, fields).exec().catch(err => console.log(err))
}

async function findOne(model, filter={}, fields=""){
    return await model.findOne(filter, fields).exec().catch(err => console.log(err))
}

async function updateOne(model, filter={}, replace={}, upsert=false){
    return await model.updateOne(filter, replace, {'upsert': upsert}).exec().catch(err => console.log(err))
}

async function deleteOne(model, entry){
    return await model.deleteOne({_id:entry._id}).exec().catch(err => console.log(err));
}

async function insertOne(model, doc){
    model.create(doc);
}
