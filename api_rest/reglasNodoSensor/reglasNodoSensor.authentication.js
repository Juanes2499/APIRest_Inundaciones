const reglasNodoSensor = require('./reglasNodoSensor.router');

const express = require('express');
const reglasNodoSensorAuth = express();

const auth = require('../../shared/authentication');

reglasNodoSensorAuth.use("/", (req, res) => {
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
                const rolConfuguracionReglasNodoSensor = req.decoded.ROL_CONFIGURACION_REGLAS_NODO_SENSOR;
    
                if(rolMaster || rolAdministrador || rolConfuguracionReglasNodoSensor){
                    reglasNodoSensor(req,res);
                }
                else{
                    return res.status(500).json({
                        success:false,
                        statusCode:500,
                        message: "The User has not access to Configuracion Reglas Node Sensor"
                    })
                }
            }
        })
});

module.exports = reglasNodoSensorAuth;