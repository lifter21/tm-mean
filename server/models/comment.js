var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    task: {type: Schema.Types.ObjectId, ref: 'Task'},
    text: String,
    createdAt: {type: Date, default: Date.now()}
});

CommentSchema.methods = {
    isCreator: function (user) {
        var creator = this.creator._id ? this.creator._id : this.creator;
        var user = user._id ? user._id : user;

        return creator.toString() === user.toString();
    }
};

module.exports = mongoose.model("Comment", CommentSchema);