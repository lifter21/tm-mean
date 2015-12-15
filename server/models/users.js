var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, unique: true},
    email: String,
    password: String
});

 module.exports = mongoose.model('users', userSchema);
