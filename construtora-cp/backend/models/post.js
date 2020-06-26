const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    
    // Imovel
    title: { type: String, required: true },
    diferencialOpt: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    condPrice: { type: String, required: true },
    iptuPrice: { type: String, required: true },
    type: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    emCondominio: { type: String, required: true },
    addressRef: { type: String, required: true },
    metragemTerreno: { type: String, required: true },
    metragemConstrucao: { type: String, required: true },
    vagas: { type: String, required: true },
    rooms: { type: String, required: true },
    baths: { type: String, required: true },
    permuta: { type: String, required: true },
    financiamento: { type: String, required: true },
        
    // Contatos
    contactTelOne: { type: String, required: true },
    contactNameOne: { type: String, required: true },
    contactTelTwo: { type: String},
    contactNameTwo: { type: String},
    
    owner: { type: String, required: true },
    telOwner: { type: String, required: true },
    emailOwner: { type: String, required: true },
    
    refNumber: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

module.exports = mongoose.model('Post', postSchema);