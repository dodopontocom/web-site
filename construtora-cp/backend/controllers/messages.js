const Message = require("../models/message");
require('dotenv').config();

exports.getMessages = (req, res, next) => {
  const messageQuery = Message.find();
  let fetchedMessages;
  messageQuery
  .then(documents => {
    fetchedMessages = documents;;
    return Message.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Message fetched ok",
      messages: fetchedMessages
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "error ao buscar messages"
    })
  });
};

exports.createMessage = (req, res, next) => {
  
  const msg = new Message({
    
    nome: req.body.nome,
    phone: req.body.phone,
    content: req.body.content,
    ref: req.body.ref,

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