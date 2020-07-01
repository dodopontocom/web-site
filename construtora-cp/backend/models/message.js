const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    
    nome: { type: String},
    phone: { type: String},
    content: { type: String}
});

module.exports = mongoose.model('Message', messageSchema);