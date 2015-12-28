var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    email: String,
    local: {
        name: String,
        passwordHash: String,
        passwordSalt: String
    },
    createdAt: {type: Date, default: Date.now()}
});

UserSchema.set('toJSON ', {getters: true, virtuals: true});

function hash(data) {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('hex')
};

UserSchema.methods = {

    validPassword: function (password) {
        return this.local.passwordHash === hash(this.local.passwordSalt + password);
    },
    setPassword: function (password) {
        var salt = 'some difficult salt string';
        this.local.passwordSalt = hash(salt);
        this.local.passwordHash = hash(this.local.passwordSalt + password);
    }
};

UserSchema.virtual('local.password').set(function (password) {
    this.setPassword(password);
});

module.exports = mongoose.model("User", UserSchema);