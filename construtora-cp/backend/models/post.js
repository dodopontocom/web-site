const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    
    // Imovel
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    condPrice: { type: String, default: "0" },
    iptuPrice: { type: String, default: "0" },
    type: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    emCondominio: { type: String, default: "0" },
    addressRef: { type: String, default: "0" },
    metragemTerreno: { type: String, required: true },
    metragemConstrucao: { type: String, default: "0" },
    vagas: { type: String, default: "0" },
    rooms: { type: String, default: "0" },
    baths: { type: String, default: "0" },
    permuta: { type: String, default: "0" },
    financiamento: { type: String, default: "0" },
        
    // Contatos
    contactTelOne: { type: String, required: true },
    contactNameOne: { type: String, required: true },
    contactTelTwo: { type: String, default: "0" },
    contactNameTwo: { type: String, default: "0" },
    
    owner: { type: String, default: "0" },
    telOwner: { type: String, default: "0" },
    emailOwner: { type: String, default: "0" },
    
    // if YES, make a water mark in photos
    diferencialOpt: { type: String, default: "0" },
    // destaque: { type: String, default: "0" },
    // exclusividade: { type: String, default: "0" },
    // oportunidade: { type: String, required: true },
    // sold: { type: String, required: true },

    refNumber: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

module.exports = mongoose.model('Post', postSchema);