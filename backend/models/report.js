const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    type: {
        type: Schema.Types.String,
        enum: ['post', 'rating'],
        required: true
    }
    comment: {
        type: Schema.Types.String
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }
    createdAt: {
        type: Schema.Types.Date,
        required: true
    }
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;