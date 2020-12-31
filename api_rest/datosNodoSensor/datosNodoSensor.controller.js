const {
    crear_datoNodoSensor,
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
    }
}