var mongoose = require('mongoose');

var immRecord = mongoose.createConnection('mongodb://127.0.0.1/immRecord');

immRecord.on('error', console.error.bind(console, 'connection error:'));
immRecord.once('open', function () {
});


var immRecordSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    record: [{
        age: {
            type: String,
            required: true,
        },
        immunization: {
            type: String,
            required: true,
        },
        lot: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        dateCompleted: {
            type: Date,
            required: true,
        }
    }],
});

var ImmRecord = immRecordSchema.model('Immunization Record', immRecordSchema);

var putNewRecord = function (id, age, immunization,
    lot, dueDate, dateCompleted, route_callback) {
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        age: age,
        immunization: immunization,
        lot: lot,
        dueDate: dueDate,
        dateCompleted: dateCompleted
    }];
    var newRecord = new ImmRecord({
        id: id,
        record: newJSON
    });
    // Here we save this line into the MongoDB Database
    newRecord.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        ImmRecord.find({ id: id }, function (err, res) {
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
var putRecordEntry = function (id, age, immunization,
    lot, dueDate, dateCompleted, route_callback) {
    // create a new JSON object to put into the table
    newJSON = {
        age: age,
        immunization: immunization,
        lot: lot,
        dueDate: dueDate,
        dateCompleted: dateCompleted
    };
    ImmRecord.findOneAndUpdate(
        { id: id }, //find a document with id
        { $push: { record: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating imm record "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                ImmRecord.find({ id: id }, function (err, res) {
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

var getAllRecords = function (id, route_callback) {
    // console.log("getting all weights");
    ImmRecord.find({ id: id }, function (err, res) {
        if (err) {
            route_callback(null, "Patient's chronic problem list not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

// this function edits an existing entry in the data 
var editRecord = function (id, age, immunization,
    lot, dueDate, dateCompleted, preEditData, route_callback) {
    console.log("editChronic called in problemListDB");
    console.log("preEditData chronicDiagnosis in editChronic in problemListDB: " + preEditData.chronicDiagnosis);
    ImmRecord.findOneAndUpdate(
        {
            id: id,
            'record.age': preEditData.age,
            'record.immunization': preEditData.immunization,
            'record.lot': preEditData.lot,
            'record.dueDate': preEditData.dueDate,
            'record.dateCompleted': preEditData.dateCompleted
        }, //find a document with the pre-edit data 
        {
            $set: {
                'record.$.age': age,
                'record.$.immunization': immunization,
                'record.$.lot': lot,
                'record.$.dueDate': dueDate,
                'record.$.dateCompleted': dateCompleted
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
                ImmRecord.find({ id: id }, function (err, res) {
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
var deleteImmRecord = function (id, preEditData, route_callback) {
    ImmRecord.findOneAndUpdate(
        {},
        {
            $pull: {
                record: {
                    age: age,
                    immunization: preEditData.immunization,
                    lot: preEditData.lot,
                    dueDate: preEditData.dueDate,
                    dateCompleted: preEditData.dateCompleted
                }
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating imm record for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                ImmRecord.find({ id: id }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('imm record deleteChronic response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

var immRecordDB = {
    putRecordEntry: putRecordEntry,
    putNewRecord: putNewRecord,
    getAllRecords: getAllRecords,
    editRecord: editRecord,
    deleteRecord: deleteImmRecord,
};

module.exports = immRecordDB;
