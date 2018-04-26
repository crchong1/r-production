var mongoose = require('mongoose');

var pharmacy = mongoose.createConnection('mongodb://127.0.0.1/pharmacy');

pharmacy.on('error', console.error.bind(console, 'connection error:'));
pharmacy.once('open', function () {
    // we're connected!
    console.log("pharmacyDB connected")
});


var pharmacySchema = mongoose.Schema({
    entries: [{
        section:{
            type: String,
            required: true,
        },
        genericName: {
            type: String,
            required: true,
        },
        proprietaryName: {
            type: String,
            required: true,
        },
        drugClass: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        manufactureDate: {
            type: String,
            required: true,
        },
        expirationDate: {
            type: String,
            required: true,
        },
        lotNumber: {
            type: String,
            required: true,
        },
        concentration: {
            type: String,
            required: true,
        },
        amountPerUnit: {
            type: String,
            required: true,
        },
        unitsRemaining: {
            type: Number,
            required: true,
        }
    }]
});

var Pharmacy = pharmacy.model('Pharmacy', pharmacySchema);

var putNewPharmacy = function (section, genericName, proprietaryName,
    drugClass, type, description, manufactureDate, expirationDate, lotNumber, concentration, amountPerUnit, 
    unitsRemaining, route_callback) {
    console.log("putNewPharmacy called in pharmacyDB")
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
        section: section,
        genericName: genericName,
        proprietaryName: proprietaryName,
        drugClass: drugClass,
        type: type,
        description: description,
        manufactureDate: manufactureDate,
        expirationDate: expirationDate,
        lotNumber: lotNumber,
        concentration: concentration,
        amountPerUnit: amountPerUnit,
        unitsRemaining: unitsRemaining
    }];
    var newPharmacy = new Pharmacy({
        entries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newPharmacy.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        Pharmacy.find({}, function (err, res) {
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

// // this function updates the data
var putPharmacyEntry = function (section, genericName, proprietaryName,
    drugClass, type, description, manufactureDate, expirationDate, lotNumber, concentration, amountPerUnit, 
    unitsRemaining, route_callback) {
    // create a new JSON object to put into the table; NOT an array
    newJSON = {
        section: section,
        genericName: genericName,
        proprietaryName: proprietaryName,
        drugClass: drugClass,
        type: type,
        description: description,
        manufactureDate: manufactureDate,
        expirationDate: expirationDate,
        lotNumber: lotNumber,
        concentration: concentration,
        amountPerUnit: amountPerUnit,
        unitsRemaining: unitsRemaining
    };
    Pharmacy.findOneAndUpdate(
        {}, //find a document with id --> make empty b/c find document itself
        //if empty find doesn't work, hardcode pharmacy name into schema
        { $push: { entries: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Pharmacy.find({}, function (err, res) {
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

var getAllPharmacy = function (route_callback) {
    // console.log("getting all weights");
    Pharmacy.find({}, function (err, res) {
        if (err) {
            route_callback(null, "Patient's pharmacy not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

// this function edits an existing entry in the data 
var editPharmacy = function (section, genericName, proprietaryName,
    drugClass, type, description, manufactureDate, expirationDate, lotNumber, concentration, amountPerUnit, 
    unitsRemaining, _id, route_callback) {
        console.log("_id in editPharmacy in pharmacyDB: ")
        console.log(_id)
    console.log("editPharmacy called in pharmacyDB");
    Pharmacy.findOneAndUpdate(
        {
            'entries._id': _id
        }, //find an entry with the unique id
        {
            $set: {
                'entries.$.section': section,
                'entries.$.genericName': genericName,
                'entries.$.proprietaryName': proprietaryName,
                'entries.$.drugClass': drugClass,
                'entries.$.type': type,
                'entries.$.description': description,
                'entries.$.manufactureDate': manufactureDate,
                'entries.$.expirationDate': expirationDate,
                'entries.$.lotNumber': lotNumber,
                'entries.$.concentration': concentration,
                'entries.$.amountPerUnit': amountPerUnit,
                'entries.$.unitsRemaining': unitsRemaining
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Pharmacy.find({}, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('pharmacyDB editPharmacy response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

// this function deletes an existing entry 
var deletePharmacy = function (_id, route_callback) {
    console.log("deletePharmacy called in pharmacyDB");
    Pharmacy.findOneAndUpdate(
        {},
        {
            $pull: {
                entries: {
                    _id: _id
                }
            }
        },
        function (err, doc) { //callback
            if (err) {
                route_callback(null, "error" + { error: err })
            }
            else {
                Pharmacy.find({}, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('pharmacyDB deletePharmacy response: ' + res);
                        route_callback(res, null);
                    }
                });
            }
        }
    )
};

var pharmacyDB = {
    putNewPharmacy: putNewPharmacy,
    putPharmacyEntry: putPharmacyEntry,
    getAllPharmacy: getAllPharmacy,
    editPharmacy: editPharmacy,
    deletePharmacy: deletePharmacy
};

module.exports = pharmacyDB;