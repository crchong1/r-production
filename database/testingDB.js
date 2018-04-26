var mongoose = require('mongoose');

var testingDB = mongoose.Schema({
    id: {
        type: Number,
        required:true,
        unique: true
    },
    HIVEntries: [{
        test:{
            type: String,
            required: true,
        },
        date:{
            type: String,
            required: true,
        },
        type:{
            type: String,
            required: true,
        },
        result:{
            type: String,
            required: true,
        }
    }],
    TBEntries: [{
        test:{
            type: String,
            required: true,
        },
        date:{
            type: String,
            required: true,
        },
        type:{
            type: String,
            required: true,
        },
        result:{
            type: String,
            required: true,
        }
    }], 
    hemoglobin: [{
        iron:{
            type: String,
            required: true,
        },
        dateDue:{
            type: String,
            required: true,
        },
        dateAdmin:{
            type: String,
            required: true,
        },
        result:{
            type: String,
            required: true,
        }
    }]
});