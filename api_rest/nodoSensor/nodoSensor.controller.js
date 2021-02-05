const {
    crear_nodoSensor,
    consultar_nodoSensor_dinamico,
    actualizar_nodoSensor,
    eliminar_nodoSensor,
} = require('./nodoSensor.service');

const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearNodoSensor: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            latitud: true,
            longitud: true,
            dispositivo_adquisicion: true,
            estado: true,   
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '01NS_01POST_PARAMETERS00',
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

        crear_nodoSensor(body, (err, errorCode, result, state) => {
            if(err){
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
                    message: "Database create error - crearNodoSensor"
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The sensor node was succesfully created`,
            })
        })
    },
    consultarNodoSensorDinamico: (req, res) => {

        const body = req.body;

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
                codigo_error: '01NS_02GET_PARAMETERS00',
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

        consultar_nodoSensor_dinamico(body, (err, errorCode, result, state) => {
            if(state === false){
                console.log(err);

                const errorData = {
                    codigo_error: errorCode,
                    mensaje_retornado: err
                }

                crearReporteLogEjecucion(errorData);

                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    errorInternalCode: errorCode,
                    message: "Database get error - error in consultarNodoSensorDinamico",
                    return: err
                })
            }

            return res.status(200).json({
                success: state,
                statusCode: 200,
                data:result
            })
        })
    },
    actualizarNodoSensor: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            id_nodo_sensor: true,
            latitud: true,
            longitud: true,
            dispositivo_adquisicion: true,   
            estado: true,   
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '01NS_03PUT_PARAMETERS00',
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

        actualizar_nodoSensor(body, (err, errorCode, result, state) => {
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
                    message: "Database put error - error in actualizarNodoSensor",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The node sensor with ID: ${body.id_nodo_sensor} was successfully updated`
            });
        })
    },
    eliminarNodoSensor: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            id_nodo_sensor: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '01NS_04DELETE_PARAMETERS00',
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

        eliminar_nodoSensor(body, (err, errorCode, result, state) => {
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
                    message: "Database delete error - error in eliminarNodoSensor",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                message: `The node sensor with ID: ${body.id_nodo_sensor} was successfully deleted`
            })
        })
    }

}