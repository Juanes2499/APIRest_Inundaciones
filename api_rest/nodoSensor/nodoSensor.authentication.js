const nodoSensorRouter = require('./nodoSensor.router');

const express = require('express');
const nodeSensorAuth = express();

const auth = require('../../shared/authentication');

nodeSensorAuth.use("/", (req, res)=>{
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
                const rolMaster = req.decoded.ROL_MASTER;
                const rolAdministrador = req.decoded.ROL_ADMINISTRADOR;
                const rolNodoSensor = req.decoded.ROL_NODO_SENSOR;
    
                if(rolMaster || rolAdministrador || rolNodoSensor){
                    nodoSensorRouter(req,res);
                }
                else{
                    return res.status(500).json({
                        success:false,
                        statusCode:500,
                        message: "The User has not access to Node Sensor"
                    })
                }
            }
        })
});

module.exports = nodeSensorAuth;