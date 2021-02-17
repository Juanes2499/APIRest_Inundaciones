const configuracionVariablesNodoSensor = require('./configuracionVariablesNodoSensor.router');

const express = require('express');
const configuracionVariablesNodoSensorAuth = express();

const auth = require('../../shared/authentication');

configuracionVariablesNodoSensorAuth.use("/", (req, res) => {
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
                const rolConfuguracionVariablesNodoSensor = req.decoded.ROL_CONFIGURACION_VARIABLES_NODO_SENSOR;
    
                if(rolMaster || rolAdministrador || rolConfuguracionVariablesNodoSensor){
                    configuracionVariablesNodoSensor(req,res);
                }
                else{
                    return res.status(500).json({
                        success:false,
                        statusCode:500,
                        message: "The User has not access to Configuracion Variables Node Sensor"
                    })
                }
            }
        })
});

module.exports = configuracionVariablesNodoSensorAuth;