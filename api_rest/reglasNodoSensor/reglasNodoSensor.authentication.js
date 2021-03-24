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
                let moduloPermiso  = false;

                try{
                    moduloPermiso =  req.decoded.PERMISOS.MS_SENSORES_NS.MOD_CONFIGURACION_REGLAS_NODO_SENSOR;
                }catch{
                    moduloPermiso  = false;
                }

                if(moduloPermiso){
                    reglasNodoSensor(req,res);
                }else{
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