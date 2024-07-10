const moongoose = require('mongoose');
const carSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    fuel: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    mile: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = moongoose.model('Car', carSchema);