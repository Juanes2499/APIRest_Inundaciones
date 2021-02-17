const {
    crear_configuracioVariableNodoSensor,
    consultar_configuracionesVariablesNodoSensor_dinamico,
    eliminar_configuracionVariablesNodoSensor_ByIDConfiguracion,
} = require('./configuracionVariablesNodoSensor.service');

const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearConfiguracioVariableNodoSensor: (req, res) => {
        
        const body = req.body;
        
        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_nodo_sensor: true,
            nombre_variable: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '03CVNS_01POST_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes} or ${verificarParametro.messageMalEscritos}, please set a all required parameters`
            }

            crearReporteLogEjecucion(errorData)

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }

        //Se llama al serivicio para crear la configuracion 
        crear_configuracioVariableNodoSensor(body, (err, errorCode, result, state) => {
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
                    message: "Database create error - error in crearConfiguracioVariableNodoSensor",
                    return: err
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The variable configuration with ID_NODO_SENSOR: ${body.id_nodo_sensor} and ID_VARIABLE: ${body.nombre_variable} was successfully created`
            })
        })
    },
    consultarConfiguracionesVariablesNodoSensorDinamico: (req, res) => {

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
                codigo_error: '03CVNS_02GET_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes} or ${verificarParametro.messageMalEscritos}, please set a all required parameters`
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
        consultar_configuracionesVariablesNodoSensor_dinamico(body, (err, errorCode, result, state) => {
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
                    message: "Database get error - error in consultarConfiguracionesVariablesNodoSensor",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                data:result,
            })
        })
    },
    eliminarConfiguracionVariablesNodoSensorByIDConfiguracion: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_configuracion: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '03CVNS_04DELETE_PARAMETER00',
                mensaje_retornado: `${verificarParametro.messageFaltantes} or ${verificarParametro.messageMalEscritos}, please set a all required parameters`
            }

            crearReporteLogEjecucion(errorData)

            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: errorData.codigo_error,
                message: errorData.mensaje_retornado
            })
        }

        //Se llama al servicio para eliminar la configuracion
        eliminar_configuracionVariablesNodoSensor_ByIDConfiguracion(body, (err, errorCode, result, state) => {
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
                    message: "Database delete error - error in eliminarConfiguracionVariablesNodoSensorByIDConfiguracion",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                message: `The variable configuration with ID_CONFIGURACION: ${body.id_configuracion} was successfully deleted`
            })
        })
    }
}