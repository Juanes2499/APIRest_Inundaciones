const {
    crear_variables_nodoSensor,
    consultar_variablesNodoSensor_dinamico,
    actualizar_variable_ByID,
    eliminar_variable_ByID_ByNombreVariable,
} = require('./variablesNodoSensor.service');

module.exports = {
    crearVariablesNodoSensor: (req, res) => {
        const body = req.body;
        crear_variables_nodoSensor(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
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

        consultar_variablesNodoSensor_dinamico(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
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
        actualizar_variable_ByID(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
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
        eliminar_variable_ByID_ByNombreVariable(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
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