const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
// getting all the users
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// ------------POST------------
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByEmailAndPassword(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
// post new user to the server side then send it again to the client side
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// ------------PATCH (UPDATE)------------

// update user by it is's id
router.patch("/users/me", auth, async (req, res) => {
  const availableUpdates = ["name", "age", "password", "email"];
  const requestKeys = Object.keys(req.body);
  const isValid = requestKeys.every((update) =>
    availableUpdates.includes(update)
  );
  if (!isValid) {
    return res.status(404).send({ error: "invalid updates" });
  }
  try {
    // const user = await User.findById(_id);
    requestKeys.forEach((field) => (req.user[field] = req.body[field]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// ------------DELETE------------

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post("/users/me/avatar",auth , upload.single("avatar"), async (req, res) => {
  req.user.avatar =  req.file.buffer;
  await req.user.save();
  res.send();
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
});
module.exports = router;
