var mongoose = require('mongoose');

var immRecord = mongoose.createConnection('mongodb://127.0.0.1/immRecord');

immRecord.on('error', console.error.bind(console, 'connection error:'));
immRecord.once('open', function () {
    console.log('immRecordDB started');
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
        },
        notes: {
            type: String,
            required: false,
        },
    }],
});

var ImmRecord = immRecord.model('Immunization Record', immRecordSchema);

var putNewRecord = function (id, age, immunization,
    lot, dueDate, dateCompleted, notes, route_callback) {
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        age: age,
        immunization: immunization,
        lot: lot,
        dueDate: dueDate,
        dateCompleted: dateCompleted,
        notes: notes,
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
    lot, dueDate, dateCompleted, notes, route_callback) {
    // create a new JSON object to put into the table
    newJSON = {
        age: age,
        immunization: immunization,
        lot: lot,
        dueDate: dueDate,
        dateCompleted: dateCompleted,
        notes: notes
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
    console.log("!!!getting all immune records");
    console.log(id);
    ImmRecord.find({ id: id }, function (err, res) {
        if (err) {
            console.log("get all records failed in DB");
            route_callback(null, "Patient's chronic problem list not found" + err);
        }
        else {
            console.log("get all records SUCCESS in DB");
            route_callback(res, null);
        }
    });
};


// this function edits an existing entry in the data 
var editRecord = function (id, age, immunization,
    lot, dueDate, dateCompleted, notes, record_id, route_callback) {
    console.log("editRecord called in problemListDB");
    ImmRecord.findOneAndUpdate(
        {
            id: id,
            'record._id': record_id, 
        }, //find a document with the pre-edit data 
        {
            $set: {
                'record.$.age': age,
                'record.$.immunization': immunization,
                'record.$.lot': lot,
                'record.$.dueDate': dueDate,
                'record.$.dateCompleted': dateCompleted,
                'record.$.notes': notes
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
                        console.log("edit route callback!!");
                        console.log('problemListDB editChronic response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

// this function deletes an existing entry 
var deleteImmRecord = function (patient_id, record_id) {
    console.log("deleteImmRecord in DB");
    // console.log(id);
        ImmRecord.findOneAndUpdate(
        {id: patient_id},
        {
            $pull: {
                record: {
                    _id: record_id
                }
            }
        },
        function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
        });
};

var immRecordDB = {
    putRecordEntry: putRecordEntry,
    putNewRecord: putNewRecord,
    getAllRecords: getAllRecords,
    editRecord: editRecord,
    deleteImmRecord: deleteImmRecord,
};

module.exports = immRecordDB;