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

                let moduloPermiso  = false;

                try{
                    moduloPermiso =  req.decoded.PERMISOS.MS_SENSORES_NS.MOD_NODO_SENSORES;
                }catch{
                    moduloPermiso  = false;
                }

                if(moduloPermiso){
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