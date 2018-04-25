var mongoose = require('mongoose');
var weight = mongoose.createConnection('mongodb://localhost/weight');


weight.on('error', console.error.bind(console, 'connection error:'));
weight.once('open', function() {
  // we're connected!
});

var weightHistory = mongoose.Schema({
    id:{
        type: Number,
        required: true,
    },
    weightAndDate: [{
        weight: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
        }
    }]
});
var WeightHistory = weight.model('Weight', weightHistory);

var putNewWeightHistory = function(id, weight, date, route_callback){
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        weight: weight,
        date: date
    }];
    var newWeightHistory = new WeightHistory({
        id: id,
        weightAndDate: newJSON
    });
    // Here we save this line into the MongoDB Database
    newWeightHistory.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        WeightHistory.find({id: id}, function(err, res){
            if(err){
                console.log(err);
            }
            else {
                // send back the data
                route_callback(res, null);
            }
        });
      });
};

// this function updates the data in the table
var putWeightEntry= function(id, weight, date, route_callback){
    // create a new JSON object to put into the table
    newJSON = {
        weight: weight,
        date: date
    };
    // pull up the schema
    var newWeightHistory = new WeightHistory({
        id: id,
        weightAndDate: newJSON
    });    
    WeightHistory.findOneAndUpdate(
        {id: id}, //find a document with id
        {$push: {weightAndDate: newJSON}},
        // weightEntryToUpdate,
        // newWeightHistory, //document to insert when nothing is found
        // {new: true, upsert: true, runValidators: true, 
        //     setDefaultsOnInsert: true}, //options
        // {new: true, upsert: true,
        //     setDefaultsOnInsert: true},
        function(err, doc){ //callback
            if(err){
                console.log("error in finding and updating weightHistory for " 
                + id);
                console.log('error: ' + err);
                route_callback(null, "error" + {error: err})
            }
            else{
                WeightHistory.find({id: id}, function(err, res){
                     if(err){
                         console.log(err);
                     }
                     else {
                         console.log('res'+res);
                        route_callback(res, null);
                     }
                });
                // route_callback(doc, null);
            }
        }
    )
};

var getAllWeights = function(id, route_callback){
    console.log("getting all weights");
    WeightHistory.find({id: id}, function(err, res){
        if(err){
            route_callback(null, "Patient's weight history not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

var weightDB = { 
    putNewWeightHistory: putNewWeightHistory,
    putWeightEntry: putWeightEntry,
    getAllWeights: getAllWeights
};

module.exports = weightDB;
