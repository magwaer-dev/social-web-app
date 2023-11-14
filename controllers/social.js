const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Post.findAll({
    include: [{ model: User, attributes: ["username"] }], // Include User information
  })
    .then((posts) => {
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
  User.findAll()
    .then((user) => {
      res.render("social/profiles", {
        pageTitle: "Profiles",
        path: "/profiles",
        user: user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred");
    });
};

exports.getProfilesAccount = (req, res, next) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      return Post.findAll({
        where: { userId: userId },
        include: [{ model: User, attributes: ["username", "profile_pic"] }],
      }).then((userPosts) => {
        res.render("social/profilesAccount", {
          pageTitle: "User Profile",
          path: `/profiles/${userId}/account`,
          user: user,
          userPosts: userPosts,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while fetching user data");
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
