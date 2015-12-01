module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var commentSchema = new Schema({
        text: String,
        task: { type: Schema.Types.ObjectId, ref: 'tasks' },
        user: { type: Schema.Types.ObjectId, ref: 'users' }
    });

    return mongoose.model('comments', commentSchema);
}