const express = require("express");
const checkAuth = require("../middleware/check-auth");
const MessageController = require("../controllers/messages");
const router = express.Router();

router.post("", checkAuth, MessageController.createMessage);
router.get("", MessageController.getMessages);

module.exports = router;

// ===================================================================
// const express = require("express");
// const checkAuth = require("../middleware/check-auth");
// const extractFile = require("../middleware/file");
// const PostController = require("../controllers/posts");
// const router = express.Router();

// router.post("", checkAuth, extractFile, PostController.createPost);

// router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// router.get("/:id", PostController.getPost);

// router.delete("/:id", checkAuth, PostController.deletePost);

// module.exports = router;