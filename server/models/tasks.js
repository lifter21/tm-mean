/**
 * Created by alex on 17.11.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    text: String
});

module.exports = mongoose.model('Tasks', taskSchema);
