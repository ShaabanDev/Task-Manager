const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require('../middleware/auth')

// getting all the users
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// getting the user using his id
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
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
    res.send({user,token});
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
    res.status(201).send({user,token});
  } catch (error) {
    res.status(400).send(error);
  }
});

// ------------PATCH (UPDATE)------------

// update user by it is's id
router.patch("/users/:id", async (req, res) => {
  const availableUpdates = ["name", "age", "password", "email"];
  const requestKeys = Object.keys(req.body);
  const isValid = requestKeys.every((update) =>
    availableUpdates.includes(update)
  );
  if (!isValid) {
    return res.status(404).send({ error: "invalid updates" });
  }
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    requestKeys.forEach((field) => (user[field] = req.body[field]));
    await user.save();
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// ------------DELETE------------

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
