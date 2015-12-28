var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = require('./comment');

var TaskSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    text: String,
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    createdAt: {type: Date, default: Date.now()}
});

TaskSchema.post('remove', function (task) {
    Comment.find({task: task}, function (err, status) {
        if (err) {
            return next(err)
        }
        console.log('Task comments were successfully removed.');
    });
});

TaskSchema.methods = {
    isCreator: function (user) {
        var creator = this.creator._id ? this.creator._id : this.creator;
        var user = user._id ? user._id : user;

        return creator.toString() === user.toString();
    }
};

module.exports = mongoose.model("Task", TaskSchema);