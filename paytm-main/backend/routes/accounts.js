const express = require('express');
const Auth = require('./auth');
const { Bank } = require('../db');
const mongoose = require("mongoose");

const accountRouter = express.Router();

accountRouter.get('/balance', Auth, async (req, res) => {
    const userId = req.userId;
    const BankAcc = await Bank.findOne({ userId: userId });
    if (BankAcc) {
        return res.status(200).json({ balance: BankAcc.balance })
    }
    else {
        return res.status(403).json({ msg: "Did not find any bank Acc" });

    }

})
accountRouter.post('/transfer', Auth, async (req, res) => {

    const { to, balance } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    const fromAcc = await Bank.findOne({ userId: req.userId }).session(session);
    if (!fromAcc || fromAcc.balance < balance) {
        await session.abortTransaction();
        return res.status(400).json({ msg: "Insufficient Balance" });
    }
    const toAcc = await Bank.findOne({ userId: to }).session(session);
    if (!toAcc || toAcc.balance < balance) {
        await session.abortTransaction();
        return res.status(400).json({ msg: "Invalid Account" });
    }
    await Bank.updateOne({ userId: req.userId }, { $inc: { balance: - balance } }).session(session);
    await Bank.updateOne({ userId: to }, { $inc: { balance: balance } }).session(session);

    await session.commitTransaction();
    return res.status(200).json({ msg: "Completed Transaction" });
})


module.exports = accountRouter;

