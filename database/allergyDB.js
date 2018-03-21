var mongoose = require('mongoose');

var allergy = mongoose.createConnection('mongodb://127.0.0.1/allergy');

allergy.on('error', console.error.bind(console, 'connection error:'));
allergy.once('open', function() {
  // we're connected!
  console.log("allergyDB connected")
});


var allergySchema = mongoose.Schema({
    //Allergies
    id: {
        type: Number,
        required: true,
        unique: true,
    },
	entries: [{
        allergen:{
            type: String,
            required: true,
            unique: true,
        },
        allergySymptoms:{
            type: String,
            required: true,
        }, 
        allergySeverity:{
            type: String,
            required: true,
        },
        allergyDateOnset:{
            type: String,
            required: true,
        },
        allergyNotes:{
            type: String,
            required: true,
            unique: true,
        },

    }]
});

var Allergy = allergy.model('Allergy', allergySchema);

var putNewAllergy = function(id, allergen, allergySymptoms, 
    allergySeverity, allergyDateOnset, allergyNotes, route_callback){
        console.log("putNewAllergy called in allergyDB")
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        allergen: allergen,
        allergySymptoms: allergySymptoms,
        allergySeverity: allergySeverity,
        allergyDateOnset: allergyDateOnset,
        allergyNotes: allergyNotes
    }];
    var newAllergy = new Allergy({
        id: id,
        entries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newAllergy.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        Allergy.find({id: id}, function(err, res){
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

// this function updates the data
var putAllergyEntry= function(id, allergen, allergySymptoms, 
    allergySeverity, allergyDateOnset, allergyNotes, route_callback){
    // create a new JSON object to put into the table; NOT an array
    newJSON = {
        allergen: allergen,
        allergySymptoms: allergySymptoms,
        allergySeverity: allergySeverity,
        allergyDateOnset: allergyDateOnset,
        allergyNotes: allergyNotes
    };
    Allergy.findOneAndUpdate(
        {id: id}, //find a document with id
        {$push: {entries: newJSON}},
        function(err, doc){ //callback
            if(err){
                console.log("error in finding and updating allergies for " 
                + id);
                console.log('error: ' + err);
                route_callback(null, "error" + {error: err})
            }
            else{
                Allergy.find({id: id}, function(err, res){
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

var getAllAllergy = function(id, route_callback){
    // console.log("getting all weights");
    Allergy.find({id: id}, function(err, res){
        if(err){
            route_callback(null, "Patient's allergies not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

var allergyDB = { 
    putNewAllergy: putNewAllergy,
    putAllergyEntry: putAllergyEntry,
    getAllAllergy: getAllAllergy,
};

module.exports = allergyDB;
