var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {

    try {
        
        if(!req.headers.authorization){
            return res.status(401).json({
                success:false,
                statusCode:401,
                message: "There is no device Token, therefore, the process cannot be executed"
            })  
        }

        const token_authentication = req.headers.authorization.replace('Bearer ', '');
        const key = process.env.TOKEN_KEY_DEVICES.toString();

        jwt.verify(token_authentication, key, (err, decoded) => {      
            if (err) {
                return res.status(401).json({
                    success:false,
                    statusCode:401,
                    message: "Invalid device Token, therefore, the process cannot be executed"
                })  
            } else {
                req.decoded = decoded;
            }
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            statusCode:401,
            message: "Token error, therefore, the process cannot be executed"
        })
    }
}

module.exports = auth