var mongoose = require('mongoose');

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
        allergyNotes:{
            type: String,
            required: true,
            unique: true,
        },
        allergySeverity:{
            type: String,
            required: true,
        },
        allergySymoptoms:{
            type: String,
            required: true,
        }, 
        allergyDateOnset:{
            type: String,
            required: true,
        },
    }]
});