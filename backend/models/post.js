const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    body: {
        type: Schema.Types.String,
        required: true
    },
    type: {
        type: Schema.Types.String,
        enum: [{Demand, Supply}],
        required: true
    },
    subject: {
        type: Schema.Types.String,
        required: true
    },
    createdAt {
        type: Schema.Types.Date,
        required: true
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;