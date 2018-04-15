var mongoose = require('mongoose');
var patientHistory = mongoose.createConnection('mongodb://localhost/patientHistory');
patientHistory.on('error', console.error.bind(console, 'connection error:'));
patientHistory.once('open', function() {
  // we're connected!
});
var patientHistory = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    livingHistory: [{
        house: {
            type: String,
        },
        startAge: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date
        }
    }],
    feedingHistory: [{
        underweight: {
            type: Boolean,
        },
        brand: {
            type: String,
        },
        amount: {
            type: String,
        },
        additions: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date
        }
    }],
    socialHistory: {
        type: String
    },
    background: {
        type: String
    }
  });
var PatientHistory = mongoose.model('PatientHistory', patientHistory);

var updateSocialHistory = function(id, text, route_callback) {
    PatientHistory.findOneAndUpdate({id: id}, { $set: { socialHistory: text }}, function(err, res){
        if(err){
            console.log(err);
        }
        else {
            // send back the data
            route_callback(text, null);
        }
    });
}

var updateBackground = function(id, text, route_callback) {
    PatientHistory.findOneAndUpdate({id: id}, { $set: { background: text }}, function(err, res){
        if(err){
            console.log(err);
        }
        else {
            // send back the data
            route_callback(text, null);
        }
    });
}

var putNewLivingHistory = function(id, house, startAge, 
    startDate, endDate, route_callback){
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        house: house,
        startAge: startAge,
        startDate: startDate,
        endDate: endDate,
    }];
    var newLivingHistory = new PatientHistory({
        id: id,
        livingHistory: newJSON
    });
    // Here we save this line into the MongoDB Database
    newLivingHistory.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        PatientHistory.find({id: id}, function(err, res){
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
var putLivingHistory= function(id, house, startAge, 
    startDate, endDate, route_callback){
    // create a new JSON object to put into the table
    newJSON = {
        house: house,
        startAge: startAge,
        startDate: startDate,
        endDate: endDate,
    };
    PatientHistory.findOneAndUpdate(
        {id: id}, //find a document with id
        {$push: {livingHistory: newJSON}},
        function(err, doc){ //callback
            if(err){
                console.log("error in finding and updating living history for " 
                + id);
                route_callback(null, "error" + {error: err})
            }
            else{
                PatientHistory.find({id: id}, function(err, res){
                    if(err){
                        console.log(err);
                    }
                    else {
                        console.log('res'+res);
                    route_callback(res, null);
                    }
                });
            }
        }
    )
};

var getAllLivingHistory = function(id, route_callback){
    PatientHistory.find({id: id}, function(err, res){
        if(err){
            route_callback(null, "Patient's living history list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

var putNewFeedingHistory = function(id, underweight, brand, amount, additions, 
    startDate, endDate, route_callback){
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        underweight: underweight,
        brand: brand,
        amount: amount,
        additions: additions,
        startDate: startDate,
        endDate: endDate
    }];
    var newFeedingHistory = new PatientHistory({
        id: id,
        feedingHistory: newJSON
    });
    // Here we save this line into the MongoDB Database
    newFeedingHistory.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        PatientHistory.find({id: id}, function(err, res){
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
var putFeedingHistory= function(id, underweight, brand, amount, additions, 
    startDate, endDate, route_callback){
    // create a new JSON object to put into the table
    newJSON = {
        underweight: underweight,
        brand: brand,
        amount: amount,
        additions: additions,
        startDate: startDate,
        endDate: endDate
    };
    PatientHistory.findOneAndUpdate(
        {id: id}, //find a document with id
        {$push: {feedingHistory: newJSON}},
        function(err, doc){ //callback
            if(err){
                console.log("error in finding and updating living history for " + id);
                route_callback(null, "error" + {error: err})
            }
            else{
                PatientHistory.find({id: id}, function(err, res){
                    if(err){
                        console.log(err);
                    }
                    else {
                        console.log('res'+res);
                    route_callback(res, null);
                    }
                });
            }
        }
    )
};

var getAllFeedingHistory = function(id, route_callback){
    PatientHistory.find({id: id}, function(err, res){
        if(err){
            route_callback(null, "Patient's feeding history list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};
var history = {
    updateSocialHistory: updateSocialHistory,
    updateBackground: updateBackground,
    putLivingHistory: putLivingHistory,
    putNewLivingHistory: putNewLivingHistory,
    getAllLivingHistory: getAllLivingHistory,
    putFeedingHistory: putFeedingHistory,
    putNewFeedingHistory: putNewFeedingHistory,
    getAllFeedingHistory: getAllFeedingHistory,
};

module.exports = history;