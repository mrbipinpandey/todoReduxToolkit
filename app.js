const express = require("express");
const app = express();
var cors = require('cors')
const mongoose = require("mongoose");
const PORT = 5000;

const User = require("./models/user");
const Todo = require("./models/todo");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const {JWT_SECRET,MONGOURI} = require('./config/keys');

//mongodb+srv://bipin:<password>@cluster0.4vsym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//mongodb+srv://bipin:K4G25zKr4xG6r9Df@cluster0.4vsym.mongodb.net/tododb?retryWrites=true&w=majority

mongoose.connect(MONGOURI);

mongoose.connection.on("connected", () => {
  console.log("connected to monogoos");
});

mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

// app.get("/", (req, res) => {
//   res.json({ message: "hello world!" });
// });

if(process.env.NODE_ENV == 'production'){
  const path = require('path')
  app.get('/',(req,res)=>{
    app.use(express.static(path.resolve(__dirname,'client','build'))) // css
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

app.listen(PORT, () => {
  console.log("server running on ", PORT);
});

//middleware
app.use(cors())
app.use(express.json());

// middleware check login
const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }

  try {
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    req.user = userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "you must be logged in" });
  }
};

// routes
// app.get('/test',requireLogin,(req,res)=>{
//     res.json({message:req.user})
// })

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(422).json({ error: "user already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await new User({
      email: email,
      password: hashedPassword,
    }).save();
    res.status(200).json({ message: "Signup success you can now login" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "user not exist" });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: "email or password incorrect" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/createtodo", requireLogin, async (req, res) => {
  const data = await new Todo({
    todo: req.body.todo,
    todoBy: req.user,
  }).save();

  res.status(201).json({ message: data });
});

app.get("/gettodos", requireLogin, async (req, res) => {
  const data = await Todo.find({
    todoBy: req.user,
  });
  res.status(201).json({ message: data });
});


app.delete('/remove/:id',requireLogin, async(req,res)=>{
    const removedTodo = await Todo.findOneAndRemove({_id:req.params.id})
    res.status(200).json({message:removedTodo})
})