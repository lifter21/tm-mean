module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var Task = require('./task')(mongoose);

    var userSchema = new Schema({
        name: String,
        email: String,
        password: String
    });

    userSchema.post('remove', function (user) {
        Task.remove({user: user}, function (err, tasks) {
            if (err) {
                console.log(err);
            }
            console.log('Tasks were successfully removed: ', tasks);
        })
    });

    return mongoose.model('users', userSchema);
}
