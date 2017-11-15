const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    stars: {
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        required: true
    },
    body: {
        type: Schema.Types.String
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    },
    ratedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;