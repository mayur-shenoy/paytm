const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect("mongodb+srv://mayurshenoy:Chinpaps2402@cluster0.y2h0m.mongodb.net/");
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;