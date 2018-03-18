var mongoose = require('mongoose');
var users = mongoose.createConnection('mongodb://localhost/users');


users.on('error', console.error.bind(console, 'connection error:'));
users.once('open', function() {
  // we're connected!
});

var userSchema = mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true,
	},
	password:{
		type: String,
        required: true,
    }
});

var User = user.model('user', userSchema);
