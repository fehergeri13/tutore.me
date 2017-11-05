const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    comment: {
        type: Schema.Types.String
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    }
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;