var mongoose = require('mongoose');
var Comment = require('./comments');

var Schema = mongoose.Schema;

var taskSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'users'},
    text: String,
    users: [{type: Schema.Types.ObjectId, ref: 'users'}]
});

taskSchema.post('remove', function (task) {
    Comment.remove({task: task}, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("Comments removed successfully. ");
    })
});

module.exports = mongoose.model('tasks', taskSchema);