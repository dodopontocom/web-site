const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    
    name: { type: String, required: true },
    phone: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Message', messageSchema);