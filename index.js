const express = require("express");
const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");
const fs = require("fs");
const { type } = require("os");

//Connection with mongoDB

mongoose
  .connect("mongodb://127.0.0.1:27017/mongo-app-1")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Mongo Error", err);
  });

//Schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

//Model

const User = mongoose.model("User", userSchema);

const app = express();
const port = 3000;

// Middleware-Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(req.headers);
  req.myUserName = "Aayushmaan";
  fs.appendFile(
    "log.txt",
    `${Date.now()}:${req.method}:${req.path}\n`,
    (err, data) => {
      next();
    }
  );
  console.log("hello from middleware 1");
  next();
});

app.get("/", (req, res) => {
  res.send(`Hello ${req.myUserName}!`);
});

app.get("/users", async (req, res) => {
  const allDbusers = await User.find({});
  res.setHeader("X-MyName", "Aayushmaan"); //Use X-{HeaderName} to set custom headers .
  const html = `
    <ul>${allDbusers
      .map((user) => `<li>${user.firstName}-${user.email}</li>`)
      .join("")}</ul>
    `;
  res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDbusers = await User.find({});
  return res.json(allDbusers);
});
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json(user);
});

app
  .route("/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    return res.json(user);
  })

  .patch(async (req, res) => {
    //Edit user with id here
    await User.findByIdAndUpdate(req.params.id, { firstName: "changed" });
    return res.json({ status: "Success" });
  })
  .delete(async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    //delete user with id here
    return res.json({ status: "Success" });
  });
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (!body || !body.first_name || !body.email || !body.gender) {
    return res.status(400).send("There is an error in your data");
  } else {
    await User.create({
      firstName: body.first_name,
      lastname: body.last_name,
      email: body.email,
      gender: body.gender,
      job_title: body.job_title,
    });
    return res.status(201).send("User created");
  }

  // console.log(res);
});

//This makes it easy to handle rather than the method written below

// app.get('/users/:id',(req,res)=>{
//     const id=Number(req.params.id);
//     const user=users.find((user)=>     //When a function doesnt return anything it has to be without curly braces else the webpage doesnt get loaded
//         user.id==id
//     );
//     return res.json(user);
// })

// app.post("/api/users",(req,res)=>{
//     //Create new user here
//     res.json({status:"pending"})
// })

// app.patch("/api/users/:id",(req,res)=>{
//     //Edit user with id here
//     res.json({status:"pending"})
// })

// app.delete("/api/users/:id",(req,res)=>{
//     //delete user with id here
//     res.json({status:"pending"})
// })

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
