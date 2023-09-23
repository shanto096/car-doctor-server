const jwt = require("jsonwebtoken");

// jwt function
const verifyToken = (req, res, next) => {
    console.log('verify');
    console.log(req.headers.authorization);
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.send({ error: true, message: "unauthorized" });

    }
    const token = authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, process.env.WEB_TOKEN, (error, decoded) = );

};
exports.verifyToken = verifyToken;