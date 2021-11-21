const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


// getting all the users
app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});


// getting the user using his id
app.get("/users/:id", (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then((user) => {
      res.send(user);
    }).catch((err) => {
      res.status(500).send();
    });
  });


// post new user to the server side then send it again to the client side
app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// post new task on the server side to then it again the client side
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((task) => {
      res.send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});


// start listening to the server
app.listen(port, () => {
  console.log(`Server Is On Port ${port}`);
});
