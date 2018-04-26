var mongoose = require('mongoose');
var users = mongoose.createConnection('mongodb://127.0.0.1/users');
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
	},
	firstname:{
		type: String,
		required: true,
	},
	lastname:{
		type: String,
		required: true,
	},
});

var User = users.model('User', userSchema);

var getUser = function (username, route_callback) {
    // console.log("getting all weights");
    User.findOne({ username: username }, function (err, res) {
        if (err) {
            route_callback(null, err);
        }
        else {
            console.log("got user: " + res);
            route_callback(res, null);
        }
    });
};

var addUser = function (username, password, firstname, lastname, route_callback) {
	var newUser = new User({
        username: username,
		password: password,
		firstname: firstname,
		lastname: lastname
    });
    // Here we save this line into the MongoDB Database
    newUser.save(function (err, data) {
        if (err) {
            route_callback(null, err);
        }
        else {
            route_callback(data, null);
        }
    });
};

var checkLogin = function (username, password, route_callback) {
    // console.log("getting all weights");
    User.findOne({ username: username, password: password }, function (err, res) {
        if (err) {
            route_callback(null, err);
        }
        if(res == null){
            route_callback("n/a", null);
        }
        if (res) {
            route_callback(res, null);
        }
    });
};

var users = {
	get_user: getUser,
    add_user: addUser,
    check_login: checkLogin
};

module.exports = users;