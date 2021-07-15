var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {

    try {
        
        if(!req.headers.authorization){
            return res.status(401).json({
                success:false,
                statusCode:401,
                message: "There is no Token, therefore, the process cannot be executed"
            })  
        }

        const token = req.headers.authorization.replace('Bearer ', '');
        const key = process.env.TOKEN_KEY.toString();

        jwt.verify(token, key, (err, decoded) => {      
            if (err) {
                return res.status(401).json({
                    success:false,
                    statusCode:401,
                    message: "Invalid Token,  therefore, the process cannot be executed"
                })  
            } else {
                req.decoded = decoded;
            }
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            statusCode:401,
            message: "Token error,  therefore, the process cannot be executed"
        })
    }
}

module.exports = auth

