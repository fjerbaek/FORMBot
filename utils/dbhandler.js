const mongoose = require('mongoose');
const {dbURL, dbPort, dbName} = require('../config.json');
mongoose.connect("mongodb://" + dbURL + ":" + dbPort + "/" + dbName, {useNewUrlParser:true, useUnifiedTopology:true}).then(() => console.log("Successfully connected to database")).catch(err => console.log(err));

module.exports = {
    find:find,
    findOne:findOne,
    findOneAndUpdate: findOneAndUpdate,
    updateOne:updateOne,
    deleteOne: deleteOne,
    insertOne: insertOne
}

//All queries are called with .exec() to make them return Promises.
//

//Finds documents of type model matching filter.
async function find(model, filter={}, fields=""){
    return await model.find(filter, fields).exec().catch(err => console.log(err))
}


//Finds a single document of type model matching filter.
async function findOne(model, filter={}, fields=""){
    return await model.findOne(filter, fields).exec().catch(err => console.log(err))
}

//Updates <replace> of type model matching filter. If not found, it inserts it iff upsert = true.
async function updateOne(model, filter={}, replace={}, upsert=false){
    return await model.updateOne(filter, replace, {'upsert': upsert}).exec().catch(err => console.log(err))
}

//Atomically finds a document and updates it. Returns the updated document.
async function findOneAndUpdate(model, filter={}, replace={}, upsert=false){
    return await model.findOneAndUpdate(filter, replace, {'upsert': upsert, 'new': true}).exec().catch(err => console.log(err))
}


//Deletes the given entry of type model
async function deleteOne(model, entry){
    return await model.deleteOne({_id:entry._id}).exec().catch(err => console.log(err));
}

//Inserts a single document of type model.
async function insertOne(model, doc){
    return model.create(doc).catch(err => console.log(err));
}
