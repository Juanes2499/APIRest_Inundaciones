const {
    crear_variables_nodoSensor,
    consultar_variablesNodoSensor_dinamico,
    actualizar_variable_ByID,
    eliminar_variable_ByID_ByNombreVariable,
} = require('./variablesNodoSensor.service');

const {crearReporteLogEjecucion} = require('../reporteLogEjecucion/reporteLogEjecucion.controller');

const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");


module.exports = {
    crearVariablesNodoSensor: (req, res) => {
        
        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            nombre_variable: true,
            detalles: true,
            tipo_dato: true,
            unidad_medida: true,  
            rango_min: true,
            rango_max: true,
            estado: true,   
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '02VNS_01POST_PARAMETER00',
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

        //Se llama al serivcio para crear la variable
        crear_variables_nodoSensor(body, (err, errorCode, result, state) => {
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
                    message: "Database create error - error in crearVariablesNodoSensor",
                    return: err
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The varible: ${body.nombre_variable} was successfully created`
            })
        })
    },
    consultarVariablesNodoSensorDinamico: (req, res) => {

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
                codigo_error: '02VNS_02GET_PARAMETER00',
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
        consultar_variablesNodoSensor_dinamico(body, (err, errorCode, result, state) => {
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
                    message: "Database get error - error in consultarVariablesNodoSensor",
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
    actualizarVariableByID: (req, res) => {

        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_variable: true,
            nombre_variable: true,
            detalles: true,
            tipo_dato: true,
            unidad_medida: true,  
            rango_min: true,
            rango_max: true,
            estado: true,  
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '02VNS_03PUT_PARAMETER00',
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

        //Se llama al servicio para actualizar la variable 
        actualizar_variable_ByID(body, (err, errorCode, result, state) => {
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
                    message: "Database put error - error in actualizarVariableByID",
                    return: err
                });
            }     
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The variable with ID_VARIABLE: ${body.id_variable} was successfully updated`
            });                
        })
    },
    eliminarVariableByIDByNombreVariable: (req, res) => {
        
        const body = req.body;

        //Se verifica si la peticion tiene los parámetros necesarios
        const parametrosEndpoint = {
            id_variable: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                codigo_error: '02VNS_04DELETE_PARAMETER00',
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

        //Se llama al servicio para eliminar la variable
        eliminar_variable_ByID_ByNombreVariable(body, (err, errorCode,  result, state) => {
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
                    message: "Database delete error - error in eliminarVariableByIDByNombreVariable",
                    return: err
                });
            }

            if(body.id_variable && body.nombre_variable){
                return res.status(200).json({
                    success: state,
                    statusCode:200,
                    message: `The variable with ID_VARIABLE: ${body.id_variable} and NOMBRE_VARIABLE: ${body.nombre_variable} was successfully deleted`
                });
            }else if(body.id_variable){
                return res.status(200).json({
                    success: state,
                    statusCode:200,
                    message: `The variable with ID_VARIABLE: ${body.id_variable} was successfully deleted`
                });                
            }else if(body.nombre_variable){
                return res.status(200).json({
                    success: state,
                    statusCode:200,
                    message: `The variable with NOMBRE_VARIABLE: ${body.nombre_variable} was successfully deleted`
                });
            }
        })
    }
}