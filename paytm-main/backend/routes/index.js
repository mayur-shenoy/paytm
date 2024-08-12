const express = require('express');
const userRouter = require('./user');
const accountRouter = require('./accounts');
const router = express.Router();

router.use('/user', userRouter);
router.use('/accounts', accountRouter);

router.get('/user', (req, res) => {
    res.send("hello");
})

module.exports = router;


