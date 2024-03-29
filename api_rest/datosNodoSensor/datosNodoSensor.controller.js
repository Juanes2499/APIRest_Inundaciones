const {
    crear_datoNodoSensor,
    consutar_datosNodoSensor_dinamico,
} = require('./datosNodoSensor.service');

const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");


module.exports = {
    crearDatoNodoSensor: (req, res) => {
        
        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_nodo_sensor: true,
            variables: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '05DNS_01POST_PARAMETER00',
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

        //Se llama al servicio para ingresar el dato
        crear_datoNodoSensor(body, (err, errorCode, result, state) => {
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
                    message: "Database create error - error in crearDatoNodoSensor",
                    return: err
                })
            }else if(state === true){
                console.log(`API CONFIRMATION: The data for the sensor node with ID_NODO_SENSOR: ${body.id_nodo_sensor} was successfully created`)
                return res.status(201).json({
                    success:state,
                    statusCode:201,
                    message: `The data for the sensor node with ID_NODO_SENSOR: ${body.id_nodo_sensor} was successfully created`
                })
            }
        })
    },
    consutarDatosNodoSensorDinamico: (req, res) => {

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
                codigo_error: '05DNS_02GET_PARAMETER00',
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
        
        //Se llama al servicio para realizar la consulta dinámica
        consutar_datosNodoSensor_dinamico(body, (err, errorCode, result, state) => {
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
                    message: "Database get error - error in consutarDatosNodoSensorDinamico",
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