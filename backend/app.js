const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post")
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://dodo:f5AXZ9fHkijdbUfc@cluster0-u8x8t.gcp.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/v1/posts", (req, res, next) => {
  const post = new Post({
    name: req.body.name,
    phone: req.body.phone,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });
  
});

app.get("/api/v1/posts", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
  
});

app.delete("/api/v1/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post Deleted!"});
  });
});

module.exports = app;
