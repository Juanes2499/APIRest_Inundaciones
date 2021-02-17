const erroresLogEjecucion = require('./erroresLogEjecucion.router');

const express = require('express');
const erroresLogEjecucionAuth = express();

const auth = require('../../shared/authentication');

erroresLogEjecucionAuth.use("/", (req, res) => {
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
                const rolErroresLogEjecucion = req.decoded.ROL_ERRORES_LOG_EJECUCION;
    
                if(rolMaster || rolAdministrador || rolErroresLogEjecucion){
                    erroresLogEjecucion(req,res);
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

module.exports = erroresLogEjecucionAuth;