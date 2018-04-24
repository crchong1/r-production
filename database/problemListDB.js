var mongoose = require('mongoose');

var problemList = mongoose.createConnection('mongodb://127.0.0.1/problemList');

problemList.on('error', console.error.bind(console, 'connection error:'));
problemList.once('open', function () {
    // we're connected!
    console.log("problemListDB connected")
});


var problemListSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    chronicEntries: [{
        chronicDiagnosis: {
            type: String,
            required: true,
        },
        chronicDetails: {
            type: String,
            required: true,
        },
        chronicTreatment: {
            type: String,
            required: true,
        },
        chronicDateOnset: {
            type: String,
            required: true,
        },
        chronicEndDate: {
            type: String,
            required: true,
        }
    }],
    acuteEntries: [{
        acuteDateOnset: {
            type: String,
            required: true,
        },
        acuteTreatment: {
            type: String,
            required: true,
        },
        acuteDetails: {
            type: String,
            required: true,
        },
        acuteDiagnosis: {
            type: String,
            required: true,
        },
        acuteEndDate: {
            type: String,
            required: true,
        }
    }]
});

var ProblemList = problemList.model('ProblemList', problemListSchema);

var putNewChronic = function (id, chronicDiagnosis, chronicDetails,
    chronicTreatment, chronicDateOnset, chronicEndDate, route_callback) {
    console.log("putNewChronic called in problemListDB")
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        chronicDiagnosis: chronicDiagnosis,
        chronicDetails: chronicDetails,
        chronicTreatment: chronicTreatment,
        chronicDateOnset: chronicDateOnset,
        chronicEndDate: chronicEndDate
    }];
    var newChronic = new ProblemList({
        id: id,
        chronicEntries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newChronic.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        ProblemList.find({ id: id }, function (err, res) {
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
var putChronicEntry = function (id, chronicDiagnosis, chronicDetails,
    chronicTreatment, chronicDateOnset, chronicEndDate, route_callback) {
    console.log("putChronicEntry called in problemListDB")
    // create a new JSON object to put into the table
    newJSON = {
        chronicDiagnosis: chronicDiagnosis,
        chronicDetails: chronicDetails,
        chronicTreatment: chronicTreatment,
        chronicDateOnset: chronicDateOnset,
        chronicEndDate: chronicEndDate
    };
    ProblemList.findOneAndUpdate(
        { id: id }, //find a document with id
        { $push: { chronicEntries: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating chronic problems for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                ProblemList.find({ id: id }, function (err, res) {
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

var getAllChronic = function (id, route_callback) {
    console.log("putNewChronic called in problemListDB")
    // console.log("getting all weights");
    ProblemList.find({ id: id }, function (err, res) {
        if (err) {
            route_callback(null, "Patient's chronic problem list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

// this function edits an existing entry in the data 
var editChronic = function (id, chronicDiagnosis, chronicDetails,
    chronicTreatment, chronicDateOnset, chronicEndDate, preEditData, route_callback) {
    console.log("editChronic called in problemListDB");
    console.log("preEditData chronicDiagnosis in editChronic in problemListDB: " + preEditData.chronicDiagnosis);
    ProblemList.findOneAndUpdate(
        {
            id: id,
            'chronicEntries.chronicDiagnosis': preEditData.diagnosis,
            'chronicEntries.chronicDetails': preEditData.details,
            'chronicEntries.chronicTreatment': preEditData.treatment,
            'chronicEntries.chronicDateOnset': preEditData.dateOnset,
            'chronicEntries.chronicEndDate': preEditData.endDate
        }, //find a document with the pre-edit data 
        {
            $set: {
                'chronicEntries.$.chronicDiagnosis': chronicDiagnosis,
                'chronicEntries.$.chronicDetails': chronicDetails,
                'chronicEntries.$.chronicTreatment': chronicTreatment,
                'chronicEntries.$.chronicDateOnset': chronicDateOnset,
                'chronicEntries.$.chronicEndDate': chronicEndDate
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
                ProblemList.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('problemListDB editChronic response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

// this function deletes an existing entry 
var deleteChronic = function (id, preEditData, route_callback) {
    console.log("deleteChronic called in problemListDB");
    console.log("preEditData chronicDiagnosis in deleteChronic in problemListDB: " + preEditData.chronicDiagnosis);
    ProblemList.findOneAndUpdate(
        {},
        {
            $pull: {
                chronicEntries: {
                    chronicDiagnosis: preEditData.diagnosis,
                    chronicDetails: preEditData.details,
                    chronicTreatment: preEditData.treatment,
                    chronicDateOnset: preEditData.dateOnset,
                    chronicEndDate: preEditData.endDate
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
                ProblemList.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('problemListDB deleteChronic response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

var putNewAcute = function (id, acuteDiagnosis, acuteDetails,
    acuteTreatment, acuteDateOnset, acuteEndDate, route_callback) {
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        acuteDiagnosis: acuteDiagnosis,
        acuteDetails: acuteDetails,
        acuteTreatment: acuteTreatment,
        acuteDateOnset: acuteDateOnset,
        acuteEndDate: acuteEndDate
    }];
    var newAcute = new ProblemList({
        id: id,
        acuteEntries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newAcute.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        ProblemList.find({ id: id }, function (err, res) {
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
var putAcuteEntry = function (id, acuteDiagnosis, acuteDetails,
    acuteTreatment, acuteDateOnset, acuteEndDate, route_callback) {
    // create a new JSON object to put into the table
    newJSON = {
        acuteDiagnosis: acuteDiagnosis,
        acuteDetails: acuteDetails,
        acuteTreatment: acuteTreatment,
        acuteDateOnset: acuteDateOnset,
        acuteEndDate: acuteEndDate
    };
    ProblemList.findOneAndUpdate(
        { id: id }, //find a document with id
        { $push: { acuteEntries: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating chronic problems for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                ProblemList.find({ id: id }, function (err, res) {
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

var getAllAcute = function (id, route_callback) {
    // console.log("getting all weights");
    ProblemList.find({ id: id }, function (err, res) {
        if (err) {
            route_callback(null, "Patient's chronic problem list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

// this function edits an existing entry in the data 
var editAcute = function (id, acuteDiagnosis, acuteDetails,
    acuteTreatment, acuteDateOnset, acuteEndDate, preEditData, route_callback) {
    console.log("editAcute called in problemListDB");
    console.log("preEditData acuteDiagnosis in editAcute in problemListDB: " + preEditData.acuteDiagnosis);
    ProblemList.findOneAndUpdate(
        {
            id: id,
            'acuteEntries.acuteDiagnosis': preEditData.diagnosis,
            'acuteEntries.acuteDetails': preEditData.details,
            'acuteEntries.acuteTreatment': preEditData.treatment,
            'acuteEntries.acuteDateOnset': preEditData.dateOnset,
            'acuteEntries.acuteEndDate': preEditData.endDate
        }, //find a document with the pre-edit data 
        {
            $set: {
                'acuteEntries.$.acuteDiagnosis': acuteDiagnosis,
                'acuteEntries.$.acuteDetails': acuteDetails,
                'acuteEntries.$.acuteTreatment': acuteTreatment,
                'acuteEntries.$.acuteDateOnset': acuteDateOnset,
                'acuteEntries.$.acuteEndDate': acuteEndDate
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
                ProblemList.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('problemListDB editAcute response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

// this function deletes an existing entry 
var deleteAcute = function (id, preEditData, route_callback) {
    console.log("deleteAcute called in problemListDB");
    console.log("preEditData acuteDiagnosis in deleteAcute in problemListDB: " + preEditData.acuteDiagnosis);
    ProblemList.findOneAndUpdate(
        {},
        {
            $pull: {
                acuteEntries: {
                    acuteDiagnosis: preEditData.diagnosis,
                    acuteDetails: preEditData.details,
                    acuteTreatment: preEditData.treatment,
                    acuteDateOnset: preEditData.dateOnset,
                    acuteEndDate: preEditData.endDate
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
                ProblemList.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('problemListDB deleteAcute response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};


var problemListDB = {
    putNewChronic: putNewChronic,
    putChronicEntry: putChronicEntry,
    getAllChronic: getAllChronic,
    editChronic: editChronic,
    deleteChronic: deleteChronic,

    putNewAcute: putNewAcute,
    putAcuteEntry: putAcuteEntry,
    getAllAcute: getAllAcute,
    editAcute: editAcute,
    deleteAcute: deleteAcute
};

module.exports = problemListDB;
