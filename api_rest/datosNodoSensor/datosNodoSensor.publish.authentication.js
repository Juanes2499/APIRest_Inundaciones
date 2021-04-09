const datosNodoSensorRouterAuth = require('./datosNodoSensor.router.auth');

const express = require('express');
const datosNodoSensorAuth = express();

const auth = require('../../shared/authenticationDevice');

datosNodoSensorAuth.use("/", (req, res) => {
    auth(req, res)
        .then(() => {

            if(req.decoded === undefined){
                req.error = ({
                    success:false,
                    statusCode:500,
                    message: "decode undefined"
                })
                return req;
            }else{
                datosNodoSensorRouterAuth(req,res);
            }
        })
});

module.exports = datosNodoSensorAuth;