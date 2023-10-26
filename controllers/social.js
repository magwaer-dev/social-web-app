const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Post.findAll({
    include: [{ model: User, attributes: ["username"] }], // Include User information
  })
    .then((posts) => {
      console.log(posts);
      res.render("social/index", {
        pageTitle: "Home",
        path: "/",
        posts: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred");
    });
};
exports.getUserAccount = (req, res, next) => {
  User.findByPk(req.session.user.id).then((user) => {
    Post.findAll({
      where: { userId: req.session.user.id },
      include: [{ model: User, attributes: ["username"] }],
    }).then((userPosts) => {
      console.log(userPosts);
      res.render("social/userAccount", {
        pageTitle: "Your account",
        path: "/userAccount",
        user: user,
        userPosts: userPosts, // Pass the array of posts to the template
      });
    });
  });
};

exports.getMessages = (req, res, next) => {
  res.render("social/messages", {
    pageTitle: "Your messages",
    path: "/messages",
  });
};

exports.getNotifications = (req, res, next) => {
  res.render("social/notifications", {
    pageTitle: "Your Notifications",
    path: "/notifications",
  });
};

exports.getProfiles = (req, res, next) => {
  res.render("social/profiles", {
    pageTitle: "Profiles",
    path: "/profiles",
  });
};

exports.getCreatePost = (req, res, next) => {
  res.render("social/post", {
    pageTitle: "Post a message",
    path: "/post",
  });
};

exports.postCreatePost = (req, res, next) => {
  const content = req.body.content;

  User.findOne({ where: { id: req.session.user.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      const createPost = new Post({
        content: content,
        userId: user.id,
      });
      return createPost.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
