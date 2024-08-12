const express = require('express');
//const { use } = require('.');
const userRouter = express.Router();
const jwt = require("jsonwebtoken");


const { Json_secret } = require('../config');
const zod = require("zod");

const { UserVerify, UsersigninVerify } = require('./verify');
const User = require('../db');
const Auth = require('./auth');
const updateBody = zod.object({
    password: zod.string().min(8).optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})


userRouter.post('/signup', UserVerify, async (req, res) => {
    const NewUser = req.body;
    const NewUser1 = await User.create(NewUser);
    const jwtToken = jwt.sign({ userId: NewUser1._id }, Json_secret);
    res.status(200).json({
        msg: "User created successfully",
        jwt: jwtToken
    });

});
userRouter.post('/signin', UsersigninVerify, (req, res) => {
    const NewUser = req.body;
    const jwtToken = jwt.sign({ userId: NewUser._id }, Json_secret);
    res.status(200).json({

        token: jwtToken
    });
})

userRouter.put('/', Auth, async (req, res) => {
    //console.log("hello");
    const userId = req.userId;
    const UpdateUser = req.body;
    const password = req.body.password;

    const { success } = updateBody.safeParse(UpdateUser);
    if (!success) {
        return res.status(411).json({ msg: "Please check the inputs / password should be minimum 8 characters" });
    }
    const user = await User.findOne({ _id: userId });
    if (user) {
        await User.updateOne({ _id: userId }, UpdateUser);
        res.status(200).json({ msg: "Updated successfully" });
    }
    else {
        res.status(411).json({ msg: "User does not exist / update failed " });
    }
});
userRouter.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";
    const user = await User.find({ $or: [{ firstName: { $regex: filter } }, { lastName: { $regex: filter } }] }, { password: 0, __v: 0 });
    //console.log(filter);
    return res.status(200).json({ user: user });


})



module.exports = userRouter;