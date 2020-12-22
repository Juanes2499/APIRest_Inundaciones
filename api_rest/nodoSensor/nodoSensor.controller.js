const {
    crear_nodoSensor,
    consultar_nodoSensor_byID,
    consultar_nodoSensor,
    actualizar_nodoSensor,
    eliminar_nodoSensor,
} = require('./nodoSensor.service');

module.exports = {
    crearNodoSensor: (req, res) => {
        const body = req.body;
        crear_nodoSensor(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearNodoSensor"
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201
            })
        })
    },
    consultarNodoSensor: (req, res) => {
        consultar_nodoSensor((err, result, state) => {
            if(err){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    message: "Database get error - error in consultarNodoSensor"
                })
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                data:result
            })
        })
    },
    consultarNodoSensorByID: (req, res) => {
        const body = req.body;
        consultar_nodoSensor_byID(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database get error - error in consultarNodoSensorByID",
                    return: err
                });
            }
            return res.json({
                success: state,
                statusCode: 200,
                data:result
            })
        })
    },
    actualizarNodoSensor: (req, res) => {
        const body = req.body;
        actualizar_nodoSensor(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
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
        eliminar_nodoSensor(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
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