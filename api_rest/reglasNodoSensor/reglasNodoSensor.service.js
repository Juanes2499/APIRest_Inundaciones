const pool = require("../../config/database");

module.exports = {
    crear_reglaNodoSensor: (data, callback) => {
        
        data.nombre_variable = data.nombre_variable.toUpperCase();

        const queryConsultarExistenciaVariableNodoSensor = `
            SELECT 
                (SELECT COUNT(*) FROM NODO_SENSOR WHERE ID_NODO_SENSOR = ?) NODO_SENSOR_EXIST,
                (SELECT COUNT(*) FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ? ) VARIABLE_EXIST
            FROM dual
        `;

        pool.query(
            queryConsultarExistenciaVariableNodoSensor,
            [data.id_nodo_sensor, data.nombre_variable],
            (error, result) => {

                const resultToJson = JSON.parse(JSON.stringify(result))[0];

                const nodoSensorExist = parseInt(resultToJson.NODO_SENSOR_EXIST);
                const variableExist = parseInt(resultToJson.VARIABLE_EXIST);

                if (nodoSensorExist === 0 && variableExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} and variable with ID_VARIABLE: ${data.nombre_variable} were not found`, null, false);
                }else if(nodoSensorExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, null, false);
                }else if(variableExist === 0){
                    return callback(`The variable with NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, null, false);
                }else if(nodoSensorExist > 0 && variableExist > 0){
                    
                    const queryComprobarExistenciaRegla = `
                        SELECT * FROM REGLAS_NODO_SENSOR
                            WHERE ID_NODO_SENSOR = ? AND NOMBRE_VARIABLE = ?
                    `;

                    pool.query(
                        queryComprobarExistenciaRegla,
                        [data.id_nodo_sensor, data.nombre_variable],
                        (error, result) => {

                            const existenciaReglaJson = JSON.parse(JSON.stringify(result))[0];

                            if(result.length > 0){
                                return callback(`The rule configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${existenciaReglaJson.ID_VARIABLE} and NOMBRE_VARIABLE: ${data.nombre_variable} already exist`, null, false);
                            }else if (result.length === 0){
                                
                                const queryCrearReglaNodoSensor = `
                                    INSERT
                                        INTO REGLAS_NODO_SENSOR 
                                        (ID_NODO_SENSOR, ID_VARIABLE, NOMBRE_VARIABLE, EXPRESION, FECHA_CREACION, HORA_CREACION)
                                    VALUES (?, (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?), ?, ?, CURDATE(), CURTIME());
                                `;

                                pool.query(
                                    queryCrearReglaNodoSensor,
                                    [data.id_nodo_sensor, data.nombre_variable, data.nombre_variable, data.expresion],
                                    (error, result) => {
                                        if(error){
                                            return callback(`The rule configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${existenciaReglaJson.ID_VARIABLE} and NOMBRE_VARIABLE: ${data.nombre_variable} could not be created`, null, false);
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
    }
}