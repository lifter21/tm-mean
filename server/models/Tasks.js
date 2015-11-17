var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    text: String
});

module.exports = mongoose.model('Tasks', TaskSchema);