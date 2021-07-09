const {
    crear_erroresLogEjecucion,
    consultar_erroresLogEjecucion,
    actualizar_errorLogEjecucion_ById,
    eliminar_errorLogEejecucion_byId
} = require('./erroresLogEjecucion.service');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

module.exports = {
    crearErroresLogEjecucion: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            codigo_error: true,
            url_endpoint: true,
            modulo: true,
            endpoint: true,   
            metodo_primario: true,
            metodo_secundario: true,
            detalles: true, 
            mensaje_pantalla: true
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '04RVNS_01POST_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            crearReporteLogEjecucion(errorData)

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }

        //Se llama al servicio para crear el tipo de error
        crear_erroresLogEjecucion(body, (err, errorCode, result, state) => {
            if(state === false){
                
                console.log(err);

                const errorData = {
                    codigo_error: errorCode,
                    mensaje_retornado: err
                }

                crearReporteLogEjecucion(errorData)

                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    errorInternalCode: errorCode,
                    message: "Database create error - error in crearErroresLogEjecucion",
                    return: err
                })
            }

            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The error type: ${body.codigo_error} was successfully created`
            })
        })
    },
    consultarErroresLogEjecucion: (req, res) => {

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
                codigo_error: '06ELE_02GET_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            crearReporteLogEjecucion(errorData)

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }

        //Se llama al servicio para la consulta dinámica

        consultar_erroresLogEjecucion(body, (err, errorCode, result, state) => {
            if(state === false){

                console.log(err);

                const errorData = {
                    codigo_error: errorCode,
                    mensaje_retornado: err
                }

                crearReporteLogEjecucion(errorData)

                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    errorInternalCode: errorCode,
                    message: "Database get error - error in consultarErroresLogEjecucion",
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
    },
    actualizarErrorLogEjecucionById: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_error: true,
            codigo_error: true,
            url_endpoint: true,
            modulo: true,
            endpoint: true,   
            metodo_primario: true,
            metodo_secundario: true,
            detalles: true, 
            mensaje_pantalla: true
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '06ELE_03PUT_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            crearReporteLogEjecucion(errorData)

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }

        //Se llama al servicio para actualizar la regla
        actualizar_errorLogEjecucion_ById(body, (err, errorCode, result, state) => {
            if(state === false){

                console.log(err);

                const errorData = {
                    codigo_error: errorCode,
                    mensaje_retornado: err
                }

                crearReporteLogEjecucion(errorData)

                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    errorInternalCode: errorCode,
                    message: "Database put error - error in actualizarErrorLogEjecucionById",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The error type with ID_ERROR: ${body.id_error} was successfully updated`
            });
        })
    },
    eliminarErrorLogEejecucionById: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_error: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '06ELE_04DELETE_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            crearReporteLogEjecucion(errorData)

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }

        //Se llama al servicio para eliminar el registro de la regla
        eliminar_errorLogEejecucion_byId(body, (err, errorCode, result, state) => {
            if(state === false){

                console.log(err);

                const errorData = {
                    codigo_error: errorCode,
                    mensaje_retornado: err
                }

                crearReporteLogEjecucion(errorData)

                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    errorInternalCode: errorCode,
                    message: "Database delete error - error in eliminarErrorLogEejecucionById",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The rule configuration with ID_ERROR: ${body.id_error} was successfully deleted`
            });
        })
    }
}
