const jwt = require("jsonwebtoken");
const { Json_secret } = require("../config");


const Auth = (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer")) { return res.status(403).json({ msg: "hello" }); }
    const token = auth.split(" ");
    //console.log(token[1]);
    jwt.verify(token[1], Json_secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "auth failed" });
        } else {
            //console.log("Hello")
            req.userId = decoded.userId;
            next();

        }
    });


}
module.exports = Auth;