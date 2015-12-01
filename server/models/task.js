module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var Comment = require('./comment')(mongoose);
    var taskSchema = new Schema({
        text: String,
        user: {type: Schema.Types.ObjectId, ref: 'users'}
    });
// Remove all Comments of task
    taskSchema.post('remove', function (task) {
        Comment.remove({task: task}, function (err, comments) {
            if (err) {
                console.log(err);
            }
            console.log('Comments were successfully removed: ', comments);
        })
    })

    return mongoose.model('tasks', taskSchema);
}