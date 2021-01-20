const {
    crear_configuracioVariableNodoSensor,
    consultar_configuracionesVariablesNodoSensor_dinamico,
    eliminar_configuracionVariablesNodoSensor_ByIDConfiguracion,
} = require('./configuracionVariablesNodoSensor.service');

module.exports = {
    crearConfiguracioVariableNodoSensor: (req, res) => {
        
        const body = req.body;
        
        crear_configuracioVariableNodoSensor(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
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

        consultar_configuracionesVariablesNodoSensor_dinamico(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
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

        eliminar_configuracionVariablesNodoSensor_ByIDConfiguracion(body, (err, result, state) => {
            if(state === false){
                return res.status(403).json({
                    success:state,
                    statusCode:403,
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