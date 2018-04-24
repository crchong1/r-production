var mongoose = require('mongoose');

var medication = mongoose.createConnection('mongodb://127.0.0.1/medication');

medication.on('error', console.error.bind(console, 'connection error:'));
medication.once('open', function () {
    // we're connected!
    console.log("medicationDB connected")
});

var medicationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    //Chronic medication list 
    chronicMedEntries: [{
        chronicMedName: {
            type: String,
            required: true,
        },
        chronicMedDose: {
            type: String,
            required: true,
        },
        chronicMedTime: {
            type: String,
            required: true,
        },
        chronicMedRoute: {
            type: String,
            required: true,
        },
        chronicMedStartDate: {
            type: String,
            required: true,
        },
        chronicMedEndDate: {
            type: String,
            required: true,
        },
        chronicMedDiagnosis: {
            type: String,
            required: true,
        }
    }],
    acuteMedEntries: [{
        acuteMedName: {
            type: String,
            required: true,
        },
        acuteMedDose: {
            type: String,
            required: true,
        },
        acuteMedTime: {
            type: String,
            required: true,
        },
        acuteMedRoute: {
            type: String,
            required: true,
        },
        acuteMedStartDate: {
            type: String,
            required: true,
        },
        acuteMedEndDate: {
            type: String,
            required: true,
        },
        acuteMedDiagnosis: {
            type: String,
            required: true,
        }
    }]
});

var Medication = medication.model('Medication', medicationSchema);

var putNewChronicMed = function (id, chronicMedName, chronicMedDose, chronicMedTime,
    chronicMedRoute, chronicMedStartDate, chronicMedEndDate, chronicMedDiagnosis,
    route_callback) {
    console.log("putNewChronicMed called in medicationDB")
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        chronicMedName: chronicMedName,
        chronicMedDose: chronicMedDose,
        chronicMedTime: chronicMedTime,
        chronicMedRoute: chronicMedRoute,
        chronicMedStartDate: chronicMedStartDate,
        chronicMedEndDate: chronicMedEndDate,
        chronicMedDiagnosis: chronicMedDiagnosis
    }];
    var newChronicMed = new Medication({
        id: id,
        chronicMedEntries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newChronicMed.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        Medication.find({ id: id }, function (err, res) {
            if (err) {
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
var putChronicMedEntry = function (id, chronicMedName, chronicMedDose, chronicMedTime,
    chronicMedRoute, chronicMedStartDate, chronicMedEndDate, chronicMedDiagnosis,
    route_callback) {
    console.log("putChronicMedEntry called in medicationDB")
    // create a new JSON object to put into the table; NOT an array
    newJSON = {
        chronicMedName: chronicMedName,
        chronicMedDose: chronicMedDose,
        chronicMedTime: chronicMedTime,
        chronicMedRoute: chronicMedRoute,
        chronicMedStartDate: chronicMedStartDate,
        chronicMedEndDate: chronicMedEndDate,
        chronicMedDiagnosis: chronicMedDiagnosis
    };
    Medication.findOneAndUpdate(
        { id: id }, //find a document with id
        { $push: { chronicMedEntries: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating chronic medications for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Medication.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('res' + res);
                        route_callback(res, null);
                    }
                });
                // route_callback(doc, null);
            }
        }
    )
};

var getAllChronicMed = function (id, route_callback) {
    console.log("putNewChronicMed called in medicationDB")
    // console.log("getting all weights");
    Medication.find({ id: id }, function (err, res) {
        if (err) {
            route_callback(null, "Patient's chronic medication list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

var putNewAcuteMed = function (id, acuteMedName, acuteMedDose, acuteMedTime,
    acuteMedRoute, acuteMedStartDate, acuteMedEndDate, acuteMedDiagnosis,
    route_callback) {
    console.log("putNewAcuteMed called in medicationDB")
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        acuteMedName: acuteMedName,
        acuteMedDose: acuteMedDose,
        acuteMedTime: acuteMedTime,
        acuteMedRoute: acuteMedRoute,
        acuteMedStartDate: acuteMedStartDate,
        acuteMedEndDate: acuteMedEndDate,
        acuteMedDiagnosis: acuteMedDiagnosis
    }];
    var newAcuteMed = new Medication({
        id: id,
        acuteMedEntries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newAcuteMed.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        Medication.find({ id: id }, function (err, res) {
            if (err) {
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
var putAcuteMedEntry = function (id, acuteMedName, acuteMedDose, acuteMedTime,
    acuteMedRoute, acuteMedStartDate, acuteMedEndDate, acuteMedDiagnosis,
    route_callback) {
    console.log("putAcuteMedEntry called in medicationDB")
    // create a new JSON object to put into the table; NOT an array
    newJSON = {
        acuteMedName: acuteMedName,
        acuteMedDose: acuteMedDose,
        acuteMedTime: acuteMedTime,
        acuteMedRoute: acuteMedRoute,
        acuteMedStartDate: acuteMedStartDate,
        acuteMedEndDate: acuteMedEndDate,
        acuteMedDiagnosis: acuteMedDiagnosis
    };
    Medication.findOneAndUpdate(
        { id: id }, //find a document with id
        { $push: { acuteMedEntries: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating acute medications for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Medication.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('res' + res);
                        route_callback(res, null);
                    }
                });
                // route_callback(doc, null);
            }
        }
    )
};

//returns all the acute medications for this patient
var getAllAcuteMed = function (id, route_callback) {
    Medication.find({ id: id }, function (err, res) {
        if (err) {
            route_callback(null, "Patient's acute medication list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};


var medicationDB = {
    putNewChronicMed: putNewChronicMed,
    putChronicMedEntry: putChronicMedEntry,
    getAllChronicMed: getAllChronicMed,
    putNewAcuteMed: putNewAcuteMed,
    putAcuteMedEntry: putAcuteMedEntry,
    getAllAcuteMed: getAllAcuteMed
};

module.exports = medicationDB;
