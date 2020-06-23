const Post = require("../models/post");
require('dotenv').config();

exports.createPost = (req, res, next) => {
  const refRandom = process.env.REF_IMOVEL_PREFIX + Math.floor((Math.random()*100000)+1);
  //const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    
    title: req.body.title,
    diferencialOpt: req.body.diferencialOpt,
    description: req.body.description,
    price: req.body.price,
    condPrice: req.body.condPrice,
    iptuPrice: req.body.iptuPrice,
    type: req.body.type,
    city: req.body.city,
    address: req.body.address,
    emCondominio: req.body.emCondominio,
    addressRef: req.body.addressRef,
    metragemTerreno: req.body.metragemTerreno,
    metragemConstrucao: req.body.metragemConstrucao,
    vagas: req.body.vagas,
    rooms: req.body.rooms,
    baths: req.body.baths,
    permuta: req.body.permuta,
    financiamento: req.body.financiamento,
    
    contactTelOne: req.body.contactTelOne,
    contactNameOne: req.body.contactNameOne,
    contactTelTwo: req.body.contactTelTwo,
    contactNameTwo: req.body.contactNameTwo,
    
    owner: req.body.owner,
    telOwner: req.body.telOwner,
    emailOwner: req.body.emailOwner,
    
    refNumber: refRandom,         
    imagePath: req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      message: "Erro ao criar anúncio!"
    })
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    //const url = req.protocol + "://" + req.get("host");
    imagePath = req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    
    title: req.body.title,
    diferencialOpt: req.body.diferencialOpt,
    description: req.body.description,
    price: req.body.price,
    condPrice: req.body.condPrice,
    iptuPrice: req.body.iptuPrice,
    type: req.body.type,
    city: req.body.city,
    address: req.body.address,
    emCondominio: req.body.emCondominio,
    addressRef: req.body.addressRef,
    metragemTerreno: req.body.metragemTerreno,
    metragemConstrucao: req.body.metragemConstrucao,
    vagas: req.body.vagas,
    rooms: req.body.rooms,
    baths: req.body.baths,
    permuta: req.body.permuta,
    financiamento: req.body.financiamento,
    
    contactTelOne: req.body.contactTelOne,
    contactNameOne: req.body.contactNameOne,
    contactTelTwo: req.body.contactTelTwo,
    contactNameTwo: req.body.contactNameTwo,
    
    owner: req.body.owner,
    telOwner: req.body.telOwner,
    emailOwner: req.body.emailOwner,

    refNumber: req.body.refRandom,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Atualizado com sucesso!" });
    } else {
      res.status(401).json({ message: "Sem autorização!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Não foi possível atualizar o anúncio!"
    })
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Erro ao buscar os anúncios!"
    })
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};