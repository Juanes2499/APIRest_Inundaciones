const {
    crear_reglaNodoSensor,
    consultar_reglasNodoSensor_dinamico,
    actualizar_reglaNodoSensor_byId,
    eliminar_reglaNodoSensor_byId,
} = require('./reglasNodoSensor.service');

const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearReglaNodoSensor: (req, res) => {
        
        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_nodo_sensor: true,
            nombre_variable: true,
            expresion: true,
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

        //Se llama al serivicio para crear la regla
        crear_reglaNodoSensor(body, (err, errorCode, result, state) => {
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
                    message: "Database create error - error in crearReglaNodoSensor",
                    return: err
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The rule configuration with ID_NODO_SENSOR: ${body.id_nodo_sensor} and NOMBRE_VARIABLE: ${body.nombre_variable} was successfully created`
            })
        })
    },
    consultarReglasNodoSensorDinamico: (req, res) => {

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
                codigo_error: '04RVNS_02GET_PARAMETER00',
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
        consultar_reglasNodoSensor_dinamico(body, (err, errorCode, result, state) => {
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
                    message: "Database get error - error in consultarReglasNodoSensorDinamico",
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
    actualizarReglaNodoSensorById: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_regla: true,
            id_nodo_sensor: true,
            nombre_variable: true,
            expresion: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '04RVNS_03PUT_PARAMETER00',
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
        actualizar_reglaNodoSensor_byId(body, (err, errorCode, result, state) => {
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
                    message: "Database put error - error in actualizarReglaNodoSensorById",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The rule configuratior with ID_REGLA: ${body.id_regla} was successfully updated`
            });
        })
    },
    eliminarReglaNodoSensorById: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_regla: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '04RVNS_04DELETE_PARAMETER00',
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
        eliminar_reglaNodoSensor_byId(body, (err, errorCode, result, state) => {
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
                    message: "Database delete error - error in eliminarReglaNodoSensorById",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The rule configuration with ID_REGLA: ${body.id_regla} was successfully deleted`
            });
        })
    }
}