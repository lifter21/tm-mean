/**
 * Created by alex on 17.11.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = require('./comments');

var taskSchema = new Schema({
    text: String
});

taskSchema.post('remove', function (task) {
    Comment.remove({taskId: task}, function (err) {
        if (err) {
            console.log(err);
        }
        //console.log(status);
    })
});

module.exports = mongoose.model('Tasks', taskSchema);
