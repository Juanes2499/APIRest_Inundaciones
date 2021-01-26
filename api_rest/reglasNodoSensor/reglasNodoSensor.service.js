const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

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
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} and variable with ID_VARIABLE: ${data.nombre_variable} were not found`, '04RVNS_01POST_GET01', null, false);
                }else if(nodoSensorExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, '04RVNS_01POST_GET02', null, false);
                }else if(variableExist === 0){
                    return callback(`The variable with NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, '04RVNS_01POST_GET03', null, false);
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
                                return callback(`The rule configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${existenciaReglaJson.ID_VARIABLE} and NOMBRE_VARIABLE: ${data.nombre_variable} already exist`, '04RVNS_01POST_GET04', null, false);
                            }else if (result.length === 0){

                                const queryVerificarConfiguracionVariable = `
                                    SELECT * FROM CONFIGURACION_VARIABLES_NODO_SENSOR
                                        WHERE ID_NODO_SENSOR = ? AND NOMBRE_VARIABLE = ?
                                `; //Verfica si la configuración de la variable con el nodo sensor existe, de lo contrario no se puede crear la regla 
                                
                                pool.query(
                                    queryVerificarConfiguracionVariable,
                                    [data.id_nodo_sensor, data.nombre_variable],
                                    (error, result) => {
                                        
                                        if(result.length === 0){
                                            return callback(`The variable configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and NOMBRE_VARIABLE: ${data.nombre_variable} has not been associated in variable configuration, please set up this configuration`, '04RVNS_01POST_GET05', null, false);
                                        }else if(result.length > 0){

                                            const queryCrearReglaNodoSensor = `
                                                INSERT
                                                    INTO REGLAS_NODO_SENSOR 
                                                    (ID_REGLA, ID_NODO_SENSOR, ID_VARIABLE, NOMBRE_VARIABLE, EXPRESION, FECHA_CREACION, HORA_CREACION)
                                                VALUES (UUID(), ?, (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?), ?, ?, CURDATE(), CURTIME());
                                            `;
            
                                            pool.query(
                                                queryCrearReglaNodoSensor,
                                                [data.id_nodo_sensor, data.nombre_variable, data.nombre_variable, data.expresion],
                                                (error, result) => {
                                                    if(error){
                                                        return callback(`The rule configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${existenciaReglaJson.ID_VARIABLE} and NOMBRE_VARIABLE: ${data.nombre_variable} could not be created`, '04RVNS_01POST_POST06', null, false);
                                                    }
                                                    return callback(null, null, result, true);
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
        )
    },
    consultar_reglasNodoSensor_dinamico: (data, callback) => {

        let queryBaseConsultarReglasNodoSensor = `
            SELECT 
                ID_REGLA,
                ID_NODO_SENSOR,
                ID_VARIABLE,
                NOMBRE_VARIABLE,
                EXPRESION,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM REGLAS_NODO_SENSOR
            ORDER BY FECHA_CREACION DESC, HORA_CREACION DESC            
        `;

        const queryConsultarReglasNodoSensorDinamico = consultaDinamica(
            queryBaseConsultarReglasNodoSensor,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarReglasNodoSensorDinamico.query == null && queryConsultarReglasNodoSensorDinamico.error === true){
            return callback(queryConsultarReglasNodoSensorDinamico.message, '04RVNS_02GET_GETPARAMETER01', null, false);
        }

        pool.query(
            queryConsultarReglasNodoSensorDinamico.query,
            [],
            (error, result) => {

                if(result.length === 0){
                    return callback(`There is/are no record(s) for rule configuration with the parameter(s) set`, '04RVNS_02GET_GET02', null, false);
                }else if (result.length > 0){
                    return callback(null, null, result, true);
                }
            }
        )
    },
    actualizar_reglaNodoSensor_byId: (data, callback) => {

        const queryConsultarExisteciaRegla = `
            SELECT * FROM REGLAS_NODO_SENSOR
                WHERE ID_REGLA = ? 
        `;

        pool.query(
            queryConsultarExisteciaRegla,
            [data.id_regla],
            (error, result) => {
                
                if(result.length === 0){
                    return callback(`The register with ID_REGLA: ${data.id_regla} was not found`, '04RVNS_03PUT_GET01', null, false);
                }else if (result.length > 0){

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
                                return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} and variable with ID_VARIABLE: ${data.nombre_variable} were not found`, '04RVNS_03PUT_GET02', null, false);
                            }else if(nodoSensorExist === 0){
                                return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, '04RVNS_03PUT_GET03', null, false);
                            }else if(variableExist === 0){
                                return callback(`The variable with NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, '04RVNS_03PUT_GET04', null, false);
                            }else if(nodoSensorExist > 0 && variableExist > 0){

                                const queryComprobarExistenciaRegla = `
                                    SELECT * FROM REGLAS_NODO_SENSOR
                                        WHERE ID_NODO_SENSOR = ? AND NOMBRE_VARIABLE = ?
                                `; //Verificar si al actualizar no existe una regla igual

                                pool.query(
                                    queryComprobarExistenciaRegla,
                                    [data.id_nodo_sensor, data.nombre_variable],
                                    (error, result) => {

                                        const existenciaReglaJson = JSON.parse(JSON.stringify(result))[0] ? JSON.parse(JSON.stringify(result))[0] : {ID_REGLA: data.id_regla} ;

                                        if(existenciaReglaJson.ID_REGLA != data.id_regla){
                                            return callback(`The rule configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${existenciaReglaJson.ID_VARIABLE} and NOMBRE_VARIABLE: ${data.nombre_variable} already exist in the rule configuration with ID_REGLA: ${existenciaReglaJson.ID_REGLA}`, '04RVNS_03PUT_GET05', null, false);
                                        }else if (existenciaReglaJson.ID_REGLA === data.id_regla){


                                            const queryVerificarConfiguracionVariable = `
                                                SELECT * FROM CONFIGURACION_VARIABLES_NODO_SENSOR
                                                    WHERE ID_NODO_SENSOR = ? AND NOMBRE_VARIABLE = ?
                                            `; //Verfica si la configuración de la variable con el nodo sensor existe, de lo contrario no se puede crear la regla 
                                            
                                            pool.query(
                                                queryVerificarConfiguracionVariable,
                                                [data.id_nodo_sensor, data.nombre_variable],
                                                (error, result) => {

                                                    if(result.length === 0){
                                                        return callback(`The variable configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and NOMBRE_VARIABLE: ${data.nombre_variable} has not been associated in variable configuration, please set up this configuration`, '04RVNS_03PUT_GET06', null, false);
                                                    }else if(result.length > 0){
    
                                                        const queryActualizarRegla = `
                                                            UPDATE REGLAS_NODO_SENSOR
                                                                SET ID_NODO_SENSOR = ?,
                                                                    ID_VARIABLE = (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?),
                                                                    NOMBRE_VARIABLE = ?,
                                                                    EXPRESION = ?,
                                                                    FECHA_ACTUALIZACION = CURDATE(),
                                                                    HORA_ACTUALIZACION = CURTIME()
                                                                WHERE ID_REGLA = ?
                                                        `;
    
                                                        pool.query(
                                                            queryActualizarRegla,
                                                            [data.id_nodo_sensor, data.nombre_variable, data.nombre_variable, data.expresion, data.id_regla],
                                                            (error, result) => {
    
                                                                if(error){
                                                                    return callback(`The register with ID_REGLA: ${data.id_regla} could not be updated`, '04RVNS_03PUT_PUT07', null, false);
                                                                }
    
                                                                return callback(null, null, null, true);
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
                    )
                }
            }       
        )
    },
    eliminar_reglaNodoSensor_byId: (data, callback) => {

        const queryConsultarExisteciaRegla = `
            SELECT * FROM REGLAS_NODO_SENSOR
                WHERE ID_REGLA = ? 
        `;

        pool.query(
            queryConsultarExisteciaRegla,
            [data.id_regla],
            (error, result) => {
                
                if(result.length === 0){
                    return callback(`The register with ID_REGLA: ${data.id_regla} was not found`, '04RVNS_04DELETE_GET01', null, false);
                }else if(result.length > 0){

                    const queryEliminarReglaNodoSensor = `
                        DELETE FROM REGLAS_NODO_SENSOR
                            WHERE ID_REGLA = ? 
                    `;

                    pool.query(
                        queryEliminarReglaNodoSensor,
                        [data.id_regla],
                        (error, result) => {

                            if(error){
                                return callback(`The register with ID_REGLA: ${data.id_regla} could not be deleted`, '04RVNS_04DELETE_DELETE02', null, false);
                            }
                            return callback(null, null, null, true);
                        }
                    )
                }
            }
        )
    }
}