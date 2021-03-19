const variablesNodoSensorRouter = require('./variablesNodoSensor.router');

const express = require('express');
const variablesNodoSensorAuth = express();

const auth = require('../../shared/authentication');

variablesNodoSensorAuth.use("/", (req, res) => {
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
                    moduloPermiso =  req.decoded.PERMISOS.MS_SENSORES_NS.MOD_VARIABLES_NODO_SENSOR;
                }catch{
                    moduloPermiso  = false;
                }

                if(moduloPermiso){
                    variablesNodoSensorRouter(req,res);
                }else{
                    return res.status(500).json({
                        success:false,
                        statusCode:500,
                        message: "The User has not access to Variables Node Sensor"
                    })
                }
            }
        })
});

module.exports = variablesNodoSensorAuth;