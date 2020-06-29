const Message = require("../models/message");
require('dotenv').config();

exports.createMessage = (req, res, next) => {
  
  const msg = new Message({
    
    name: req.body.name,
    phone: req.body.phone,
    content: req.body.content

  });
  
  msg.save().then(createdMessage => {
    console.log("body content: " + req.body.content);
    res.status(201).json({
      message: "Mensagem enviada com sucesso",
      post: {
        ...createdMessage,
        id: createdMessage._id
      }
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      message: "Erro ao enviar mensagem!"
    })
  });
};