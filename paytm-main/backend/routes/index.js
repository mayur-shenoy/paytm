const express = require('express');
const userRouter = require('./user');

const router = express.Router();

router.use('/user', userRouter);

router.get('/user', (req, res) => {
    res.send("hello");
})

module.exports = router;


