const pool = require("../../config/database");

module.exports = {
    crear_configuracioVariableNodoSensor: (data, callback) => {

        const queryVerificarExistenciaVariableNodo = `
            SELECT 
                (SELECT COUNT(*) FROM NODO_SENSOR WHERE ID_NODO_SENSOR = ?) NODO_SENSOR_EXIST,
                (SELECT COUNT(*) FROM VARIABLES_NODO_SENSOR WHERE ID_VARIABLE = ?) VARIABLE_EXIST
            FROM dual
        `;
        
        pool.query(
            queryVerificarExistenciaVariableNodo,
            [data.id_nodo_sensor, data.id_variable],
            (error, result) => {
                
                const resultToJson = JSON.parse(JSON.stringify(result))[0];

                const nodoSensorExist = parseInt(resultToJson.NODO_SENSOR_EXIST);
                const variableExist = parseInt(resultToJson.VARIABLE_EXIST);

                if (nodoSensorExist === 0 && variableExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} and variable with ID_VARIABLE: ${data.id_variable} were not found`, null, false);
                }else if(nodoSensorExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, null, false);
                }else if(variableExist === 0){
                    return callback(`The variable with ID_VARIABLE: ${data.id_variable} was not found`, null, false);
                }else if(nodoSensorExist > 0 && variableExist > 0){
                    
                    const queryComprobarExistenciaConfiguracion = `
                        SELECT * FROM CONFIGURACION_VARIABLES_NODO_SENSOR
                            WHERE ID_NODO_SENSOR = ? AND ID_VARIABLE = ?
                    `;

                    pool.query(
                        queryComprobarExistenciaConfiguracion,
                        [data.id_nodo_sensor, data.id_variable],
                        (error, result) => {

                            if(result.length > 0){
                                return callback(`The variable configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${data.id_variable} already exist`, null, false);
                            }else if(result.length === 0){

                                const queryCrearConfiguracionVariableNodoSensor = `
                                    INSERT
                                        INTO CONFIGURACION_VARIABLES_NODO_SENSOR
                                        (ID_NODO_SENSOR, ID_VARIABLE, FECHA_CREACION, HORA_CREACION)
                                    VALUES
                                        (?, ?, CURDATE(), CURTIME())
                                `;

                                pool.query(
                                    queryCrearConfiguracionVariableNodoSensor,
                                    [data.id_nodo_sensor, data.id_variable],
                                    (error, result) => {
                                        if(error){
                                            return callback(`The variable configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${data.id_variable} could not be created`, null, false);
                                        }
                                        return callback(null, result, true);
                                    }
                                )
                            }

                        }
                    )
                }
            }
        )
    },
    
}