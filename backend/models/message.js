const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: Schema.Types.String,
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    }
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;