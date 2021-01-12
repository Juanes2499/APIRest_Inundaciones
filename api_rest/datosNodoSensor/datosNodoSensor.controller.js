const {
    crear_datoNodoSensor,
    consutar_datosNodoSensor_dinamico,
} = require('./datosNodoSensor.service');

module.exports = {
    crearDatoNodoSensor: (req, res) => {
        
        const body = req.body;

        crear_datoNodoSensor(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - error in crearDatoNodoSensor",
                    return: err
                })
            }else if(state === true){
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
        
        consutar_datosNodoSensor_dinamico(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
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