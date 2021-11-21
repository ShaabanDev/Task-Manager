const express = require("express");
const User = require("../models/user");
const router = express.Router();

// getting all the users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send();
  }
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

// post new user to the server side then send it again to the client side
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(404).send(error);
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
    //   const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const user = await User.findById(_id);
    requestKeys.forEach((field)=>user[field]=req.body[field]);
    await user.save();
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    console.log(error)
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
