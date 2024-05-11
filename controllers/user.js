const mongoose=require('mongoose');
const User=require("../models/User")

async function handleGetAllUsers(req,res){
    const allDbusers = await User.find({});
    return res.json(allDbusers);
}

async function handleGetUserById(req,res){
    const user = await User.findById(req.params.id);
    return res.json(user);
}

async function handleUpdateUserById(req,res){
    await User.findByIdAndUpdate(req.params.id, { firstName: "changed" });
    return res.json({ status: "Success" });
}

async function handleDeleteUserById(req,res){
    await User.findByIdAndDelete(req.params.id);
    //delete user with id here
    return res.json({ status: "Success" });
}

async function handleCreateNewUser(req,res){
    const body = req.body;
  if (!body || !body.first_name || !body.email || !body.gender) {
    return res.status(400).send("There is an error in your data");
  } else {
    const result = await User.create({
      firstName: body.first_name,
      lastname: body.last_name,
      email: body.email,
      gender: body.gender,
      job_title: body.job_title,
    });
    return res.status(201).json({"msg":"success","id": result._id});
  }
}

module.exports={
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}