const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    firstName: {
        type: Schema.Types.String
    },
    lastName: {
        type: Schema.Types.String
    },
    isAdmin: {
        type: Schema.Types.Boolean,
        default: false
    },
    registeredAt: {
        type: Schema.Types.Date,
        required: true
    },
    lastLoginAt: {
        type: Schema.Types.Date
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    trustedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;