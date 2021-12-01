const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");
// ------------POST------------
// post new task on the server side to then it again the client side
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});
// ------------GET------------
// getting the task by it id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);

    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});
// getting all the tasks
router.get("/tasks", auth, async (req, res) => {
  const match ={}
  if(req.query.completed){
    match.completed = req.query.completed
  }
  try {
    await req.user.populate({
      path:"tasks",
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip)
      }
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

// ------------PATCH (UPDATE)------------
// update task by it is's id
router.patch("/tasks/:id", auth, async (req, res) => {
  const availableUpdates = ["description", "completed"];
  const requestKeys = Object.keys(req.body);
  const isValid = requestKeys.every((update) =>
    availableUpdates.includes(update)
  );
  if (!isValid) {
    return res.status(404).send({ error: "invalid updates" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    requestKeys.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// ------------DELETE------------

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
