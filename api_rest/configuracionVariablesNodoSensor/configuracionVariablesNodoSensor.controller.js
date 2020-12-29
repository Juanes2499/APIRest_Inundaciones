const {
    crear_configuracioVariableNodoSensor,
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
                message: `The variable configuration with ID_NODO_SENSOR: ${body.id_nodo_sensor} and ID_VARIABLE: ${body.id_variable} was successfully created`
            })
        })
    }
}