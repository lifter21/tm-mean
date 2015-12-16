var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    task: {type: Schema.Types.ObjectId, ref: 'tasks'},
    creator: {type: Schema.Types.ObjectId, ref: 'users'},
    text: String
});


//module.exports = mongoose.model('Comment', commentSchema);
module.exports = mongoose.model('comments', commentSchema);
