const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    
    title: { type: String, required: true },
    price: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    metragem: { type: String, required: true },
    rooms: { type: String, required: true },
    baths: { type: String, required: true },
    permuta: { type: String, required: true },
    type: { type: String, required: true },
    owner: { type: String, required: true },
    contact: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

module.exports = mongoose.model('Post', postSchema);