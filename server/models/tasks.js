
    var mongoose = require('mongoose');

    var Comment = require('./comments');

var Schema = mongoose.Schema;
var taskSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    text: String,
    sharedFor: []
});

taskSchema.post('remove', function (task) {
    Comment.remove({task: task}, function (err, status) {
        if (err) {
            return console.error(err);
        }
        console.log("Comments removed successfully");
    })
});

module.exports = mongoose.model('tasks', taskSchema);