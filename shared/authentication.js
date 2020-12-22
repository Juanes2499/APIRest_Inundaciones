var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    const key = process.env.TOKEN_KEY.toString();
    try {
        jwt.verify(token, key, (err, decoded) => {      
            if (err) {
              return res.json({ mensaje: 'Invalid token' });    
            } else {
              req.decoded = decoded;  
              next();
            }
        })
        console.log(req.decoded)
    } catch (error) {
        return res.status(500).json({
            success:state,
            statusCode:500,
            message: "Token error"
        })
    }
}

module.exports = auth

