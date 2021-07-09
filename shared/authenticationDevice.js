var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {

    try {
        
        if(!req.headers.authorization){
            return res.status(500).json({
                success:false,
                statusCode:500,
                message: "There is no device token authentication"
            })  
        }

        const token_authentication = req.headers.authorization.replace('Bearer ', '');
        const key = process.env.TOKEN_KEY_DEVICES.toString();

        jwt.verify(token_authentication, key, (err, decoded) => {      
            if (err) {
                return res.status(500).json({
                    success:false,
                    statusCode:500,
                    message: "Invalid device token authentication"
                })  
            } else {
                req.decoded = decoded;
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            statusCode:500,
            message: "Token error"
        })
    }
}

module.exports = auth