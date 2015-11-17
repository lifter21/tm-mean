var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Tasks' },
    text: String,
    user: String
});

module.exports = mongoose.model('Comments', CommentSchema);
