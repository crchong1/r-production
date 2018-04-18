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
        },
        chronicMedNotes: {
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
        },
        acuteMedNotes: {
            type: String,
            required: true,
        }
    }]
});

var Medication = medication.model('Medication', medicationSchema);

var putNewChronicMed = function (id, chronicMedName, chronicMedDose, chronicMedTime,
    chronicMedRoute, chronicMedStartDate, chronicMedEndDate, chronicMedDiagnosis, chronicMedNotes,
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
        chronicMedDiagnosis: chronicMedDiagnosis,
        chronicMedNotes: chronicMedNotes
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
    chronicMedRoute, chronicMedStartDate, chronicMedEndDate, chronicMedDiagnosis, chronicMedNotes,
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
        chronicMedDiagnosis: chronicMedDiagnosis,
        chronicMedNotes: chronicMedNotes
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

// this function edits an existing entry in the data 
var editChronicMed = function (id, chronicMedName, chronicMedDose,
    chronicMedTime, chronicMedRoute, chronicMedStartDate, chronicMedEndDate,
    chronicMedDiagnosis, chronicMedNotes, preEditData, route_callback) {
    console.log("editChronicMed called in medicationDB");
    console.log("preEditData chronicMedName in editChronicMed in medicationDB: " + preEditData.chronicMedName);
    Medication.findOneAndUpdate(
        {
            id: id,
            'chronicMedEntries.chronicMedName': preEditData.medName,
            'chronicMedEntries.chronicMedDose': preEditData.medDose,
            'chronicMedEntries.chronicMedTime': preEditData.medTime,
            'chronicMedEntries.chronicMedRoute': preEditData.medRoute,
            'chronicMedEntries.chronicMedStartDate': preEditData.medStartDate,
            'chronicMedEntries.chronicMedEndDate': preEditData.medEndDate,
            'chronicMedEntries.chronicMedDiagnosis': preEditData.medDiagnosis,
            'chronicMedEntries.chronicMedNotes': preEditData.medNotes
        }, //find a document with the pre-edit data 
        {
            $set: {
                'chronicMedEntries.$.chronicMedName': chronicMedName,
                'chronicMedEntries.$.chronicMedDose': chronicMedDose,
                'chronicMedEntries.$.chronicMedTime': chronicMedTime,
                'chronicMedEntries.$.chronicMedRoute': chronicMedRoute,
                'chronicMedEntries.$.chronicMedStartDate': chronicMedStartDate,
                'chronicMedEntries.$.chronicMedEndDate': chronicMedEndDate,
                'chronicMedEntries.$.chronicMedDiagnosis': chronicMedDiagnosis,
                'chronicMedEntries.$.chronicMedNotes': chronicMedNotes
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating chronic problems for "
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
                        console.log('medicationDB editChronicMed response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

// this function deletes an existing entry 
var deleteChronicMed = function (id, preEditData, route_callback) {
    console.log("deleteChronicMed called in medicationDB");
    console.log("preEditData chronicMedName in deleteChronicMed in medicationDB: " + preEditData.medName);
    Medication.findOneAndUpdate(
        {},
        {
            $pull: {
                chronicMedEntries: {
                    chronicMedName: preEditData.medName,
                    chronicMedDose: preEditData.medDose,
                    chronicMedTime: preEditData.medTime,
                    chronicMedRoute: preEditData.medRoute,
                    chronicMedStartDate: preEditData.medStartDate,
                    chronicMedEndDate: preEditData.medEndDate,
                    chronicMedDiagnosis: preEditData.medDiagnosis,
                    chronicMedNotes: preEditData.medNotes
                }
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating chronic problems for "
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
                        console.log('medicationDB deleteChronicMed response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};


//acute medication functions
var putNewAcuteMed = function (id, acuteMedName, acuteMedDose, acuteMedTime,
    acuteMedRoute, acuteMedStartDate, acuteMedEndDate, acuteMedDiagnosis, acuteMedNotes,
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
        acuteMedDiagnosis: acuteMedDiagnosis,
        acuteMedNotes: acuteMedNotes
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
    acuteMedRoute, acuteMedStartDate, acuteMedEndDate, acuteMedDiagnosis, acuteMedNotes,
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
        acuteMedDiagnosis: acuteMedDiagnosis,
        acuteMedNotes: acuteMedNotes
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

// this function edits an existing entry in the data 
var editAcuteMed = function (id, acuteMedName, acuteMedDose,
    acuteMedTime, acuteMedRoute, acuteMedStartDate, acuteMedEndDate,
    acuteMedDiagnosis, acuteMedNotes, preEditData, route_callback) {
    console.log("editAcuteMed called in medicationDB");
    console.log("preEditData acuteMedName in editAcuteMed in medicationDB: " + preEditData.acuteMedName);
    Medication.findOneAndUpdate(
        {
            id: id,
            'acuteMedEntries.acuteMedName': preEditData.medName,
            'acuteMedEntries.acuteMedDose': preEditData.medDose,
            'acuteMedEntries.acuteMedTime': preEditData.medTime,
            'acuteMedEntries.acuteMedRoute': preEditData.medRoute,
            'acuteMedEntries.acuteMedStartDate': preEditData.medStartDate,
            'acuteMedEntries.acuteMedEndDate': preEditData.medEndDate,
            'acuteMedEntries.acuteMedDiagnosis': preEditData.medDiagnosis,
            'acuteMedEntries.acuteMedNotes': preEditData.medNotes
        }, //find a document with the pre-edit data 
        {
            $set: {
                'acuteMedEntries.$.acuteMedName': acuteMedName,
                'acuteMedEntries.$.acuteMedDose': acuteMedDose,
                'acuteMedEntries.$.acuteMedTime': acuteMedTime,
                'acuteMedEntries.$.acuteMedRoute': acuteMedRoute,
                'acuteMedEntries.$.acuteMedStartDate': acuteMedStartDate,
                'acuteMedEntries.$.acuteMedEndDate': acuteMedEndDate,
                'acuteMedEntries.$.acuteMedDiagnosis': acuteMedDiagnosis,
                'acuteMedEntries.$.acuteMedNotes': acuteMedNotes
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating acute problems for "
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
                        console.log('medicationDB editAcuteMed response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

// this function deletes an existing entry 
var deleteAcuteMed = function (id, preEditData, route_callback) {
    console.log("deleteAcuteMed called in medicationDB");
    console.log("preEditData acuteMedName in deleteAcuteMed in medicationDB: " + preEditData.medName);
    Medication.findOneAndUpdate(
        {},
        {
            $pull: {
                acuteMedEntries: {
                    acuteMedName: preEditData.medName,
                    acuteMedDose: preEditData.medDose,
                    acuteMedTime: preEditData.medTime,
                    acuteMedRoute: preEditData.medRoute,
                    acuteMedStartDate: preEditData.medStartDate,
                    acuteMedEndDate: preEditData.medEndDate,
                    acuteMedDiagnosis: preEditData.medDiagnosis,
                    acuteMedNotes: preEditData.medNotes
                }
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating acute problems for "
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
                        console.log('medicationDB deleteAcuteMed response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};



var medicationDB = {
    putNewChronicMed: putNewChronicMed,
    putChronicMedEntry: putChronicMedEntry,
    getAllChronicMed: getAllChronicMed,
    editChronicMed: editChronicMed,
    deleteChronicMed: deleteChronicMed,

    putNewAcuteMed: putNewAcuteMed,
    putAcuteMedEntry: putAcuteMedEntry,
    getAllAcuteMed: getAllAcuteMed,
    editAcuteMed: editAcuteMed,
    deleteAcuteMed: deleteAcuteMed
};

module.exports = medicationDB;
