const reporteLogEjecucion = require('./reporteLogEjecucion.router');

const express = require('express');
const reporteLogEjecucionAuth = express();

const auth = require('../../shared/authentication');

reporteLogEjecucionAuth.use("/", (req, res) => {
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
                const rolreporteLogEjecucion = req.decoded.ROL_REPORTES_ERRORES_LOG_EJECUCION;
    
                if(rolMaster || rolAdministrador || rolreporteLogEjecucion){
                    reporteLogEjecucion(req,res);
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

module.exports = reporteLogEjecucionAuth;