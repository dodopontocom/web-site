const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    content: { type: String }
});

module.exports = mongoose.model('Post', postSchema);