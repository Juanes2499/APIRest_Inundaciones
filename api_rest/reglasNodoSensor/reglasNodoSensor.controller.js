const {
    crear_reglaNodoSensor,
    consultar_reglasNodoSensor_dinamico,
    actualizar_reglaNodoSensor_byId,
    eliminar_reglaNodoSensor_byId,
} = require('./reglasNodoSensor.service');

module.exports = {
    crearReglaNodoSensor: (req, res) => {
        
        const body = req.body;

        crear_reglaNodoSensor(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
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

        consultar_reglasNodoSensor_dinamico(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
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

        actualizar_reglaNodoSensor_byId(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
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

        eliminar_reglaNodoSensor_byId(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarVariableByIDByNombreVariable",
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