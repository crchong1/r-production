var mongoose = require('mongoose');

var pharmacy = mongoose.createConnection('mongodb://127.0.0.1/pharmacy');

pharmacy.on('error', console.error.bind(console, 'connection error:'));
pharmacy.once('open', function () {
    // we're connected!
    console.log("pharmacyDB connected")
});


var pharmacySchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
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

var putNewPharmacy = function (id, genericName, proprietaryName,
    drugClass, type, description, manufactureDate, expirationDate, lotNumber, concentration, amountPerUnit, 
    unitsRemaining, route_callback) {
    console.log("putNewPharmacy called in pharmacyDB")
    // what is unique about the data is now that it is all stored in an array
    newJSON = [{
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
        id: id,
        entries: newJSON
    });
    // Here we save this line into the MongoDB Database
    newPharmacy.save(function (err, data) {
        if (err) return console.error(err);
        // we re-find the item so we can send back the data
        Pharmacy.find({ id: id }, function (err, res) {
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
var putPharmacyEntry = function (id, genericName, proprietaryName,
    drugClass, type, description, manufactureDate, expirationDate, lotNumber, concentration, amountPerUnit, 
    unitsRemaining, route_callback) {
    // create a new JSON object to put into the table; NOT an array
    newJSON = {
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
        { id: id }, //find a document with id
        { $push: { entries: newJSON } },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating pharmacy for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Pharmacy.find({ id: id }, function (err, res) {
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

var getAllPharmacy = function (id, route_callback) {
    // console.log("getting all weights");
    Pharmacy.find({ id: id }, function (err, res) {
        if (err) {
            route_callback(null, "Patient's pharmacy not found" + err);
        }
        else {
            route_callback(res, null);
        }
    });
};

// this function edits an existing entry in the data 
var editPharmacy = function (id, genericName, proprietaryName,
    drugClass, type, description, manufactureDate, expirationDate, lotNumber, concentration, amountPerUnit, 
    unitsRemaining, preEditData, route_callback) {
    console.log("editPharmacy called in pharmacyDB");
    console.log("preEditData genericName in editPharmacy in pharmacyDB: " + preEditData.genericName);
    Pharmacy.findOneAndUpdate(
        {
            id: id,
            'entries.genericName': preEditData.genericName,
            'entries.proprietaryName': preEditData.proprietaryName,
            'entries.drugClass': preEditData.drugClass,
            'entries.type': preEditData.type,
            'entries.description': preEditData.description,
            'entries.manufactureDate': preEditData.manufactureDate,
            'entries.expirationDate': preEditData.expirationDate,
            'entries.lotNumber': preEditData.lotNumber,
            'entries.concentration': preEditData.concentration,
            'entries.amountPerUnit': preEditData.amountPerUnit,
            'entries.unitsRemaining': preEditData.unitsRemaining
        }, //find a document with the pre-edit data 
        {
            $set: {
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
                console.log("error in finding and updating pharmacy for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Pharmacy.find({ id: id }, function (err, res) {
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
var deletePharmacy = function (id, preEditData, route_callback) {
    console.log("deletePharmacy called in pharmacyDB");
    console.log("preEditData genericName in deletePharmacy in pharmacyDB: " + preEditData.genericName);
    Pharmacy.findOneAndUpdate(
        {},
        {
            $pull: {
                entries: {
                    genericName: preEditData.genericName,
                    proprietaryName: preEditData.proprietaryName,
                    drugClass: preEditData.drugClass,
                    type: preEditData.type,
                    description: preEditData.description,
                    manufactureDate: preEditData.manufactureDate,
                    expirationDate: preEditData.expirationDate,
                    lotNumber: preEditData.lotNumber,
                    concentration: preEditData.concentration,
                    amountPerUnit: preEditData.amountPerUnit,
                    unitsRemaining: preEditData.unitsRemaining
                }
            }
        },
        function (err, doc) { //callback
            if (err) {
                console.log("error in finding and updating pharmacy for "
                    + id);
                console.log('error: ' + err);
                route_callback(null, "error" + { error: err })
            }
            else {
                Pharmacy.find({ id: id }, function (err, res) {
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