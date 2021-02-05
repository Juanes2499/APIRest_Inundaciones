const {
    crear_reporteLogEjecucion,
    consultar_ReporteLogEjecucion_dinamico
} = require('./reporteLogEjecucion.service');

//const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearReporteLogEjecucion: (req) => {
        
        const body = req;

        crear_reporteLogEjecucion(body, (err, errorCode, result, state) => {
            if(state === false){
                return {
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearReporteLogEjecucion"
                }
            }
            return true;
        })
    },
    consultarReporteLogEjecucionDinamico: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            seleccionar: true,
            condicion: true,
            agrupar: true,
            ordenar: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '07RLE_02GET_PARAMETERS00',
                mensaje_retornado: `${verificarParametro.messageFaltantes} or ${verificarParametro.messageMalEscritos}, please set a all required parameters`
            }

            crear_reporteLogEjecucion(errorData, (err, errorCode, result, state) =>{})

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }
        
        //Se llama al servicio para realizar la consulta dinámica
        consultar_ReporteLogEjecucion_dinamico(body, (err, errorCode, result, state) => {
            if(state === false){

                console.log(err);

                const errorData = {
                    codigo_error: errorCode,
                    mensaje_retornado: err
                }

                crear_reporteLogEjecucion(errorData, (err, errorCode, result, state) =>{})

                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    errorInternalCode: errorCode,
                    message: "Database get error - error in consultarReporteLogEjecucionDinamico",
                    return: err
                });
            }else if(result.length > 0){
                return res.status(200).json({
                    success: state,
                    statusCode: 200,
                    data:result
                })
            }
        })
    }
}