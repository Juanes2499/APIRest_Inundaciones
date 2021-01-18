const {
    crear_reglaNodoSensor,
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
    }
}