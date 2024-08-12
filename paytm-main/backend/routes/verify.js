const z = require('zod');
const express = require('express');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('../db');
const { Json_secret } = require('../config');

const zodUsersignup = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()

})
const zodUsersignin = z.object({
    username: z.string().email(),
    password: z.string()
});


const UserVerify = async (req, res, next) => {

    const { success } = zodUsersignin.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ msg: "Wrong inputs" });

    }
    const NewUser = req.body;
    const Userstatus = await User.findOne(NewUser);
    if (Userstatus) {


        res.status(411).json({ msg: "User already exists" });
    }
    else {
        next();
    }
}


const UsersigninVerify = async (req, res, next) => {

    const { success } = zodUsersignin.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ msg: "Wrong inputs" });

    }
    const NewUser = req.body;
    const Userstatus = await User.findOne(NewUser);
    if (Userstatus) {

        const jwtToken = jwt.sign({ userId: Userstatus._id }, Json_secret);
        res.status(200).json({

            token: jwtToken
        });
    }
    else {
        return res.status(411).json({ msg: "User not found" });
    }
}



module.exports = { UserVerify, UsersigninVerify };