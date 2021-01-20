const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_configuracioVariableNodoSensor: (data, callback) => {

        data.nombre_variable = data.nombre_variable.toUpperCase();  

        const queryVerificarExistenciaVariableNodo = `
            SELECT 
                (SELECT COUNT(*) FROM NODO_SENSOR WHERE ID_NODO_SENSOR = ?) NODO_SENSOR_EXIST,
                (SELECT COUNT(*) FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ? ) VARIABLE_EXIST
            FROM dual
        `;
        
        pool.query(
            queryVerificarExistenciaVariableNodo,
            [data.id_nodo_sensor, data.nombre_variable],
            (error, result) => {
                
                const resultToJson = JSON.parse(JSON.stringify(result))[0];

                const nodoSensorExist = parseInt(resultToJson.NODO_SENSOR_EXIST);
                const variableExist = parseInt(resultToJson.VARIABLE_EXIST);

                if (nodoSensorExist === 0 && variableExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} and variable with ID_VARIABLE: ${data.id_variable} were not found`, null, false);
                }else if(nodoSensorExist === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, null, false);
                }else if(variableExist === 0){
                    return callback(`The variable with NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, null, false);
                }else if(nodoSensorExist > 0 && variableExist > 0){
                    
                    const queryComprobarExistenciaConfiguracion = `
                        SELECT * FROM CONFIGURACION_VARIABLES_NODO_SENSOR
                            WHERE ID_NODO_SENSOR = ? AND NOMBRE_VARIABLE = ?
                    `;

                    pool.query(
                        queryComprobarExistenciaConfiguracion,
                        [data.id_nodo_sensor, data.nombre_variable],
                        (error, result) => {

                            const existenciaConfiguracionVarJson = JSON.parse(JSON.stringify(result))[0];

                            if(result.length > 0){
                                return callback(`The variable configuration with ID_NODO_SENSOR: ${data.id_nodo_sensor} and ID_VARIABLE: ${existenciaConfiguracionVarJson.ID_VARIABLE} and NOMBRE_VARIABLE: ${data.nombre_variable} already exist`, null, false);
                            }else if(result.length === 0){

                                const queryCrearConfiguracionVariableNodoSensor = `
                                    INSERT
                                        INTO CONFIGURACION_VARIABLES_NODO_SENSOR
                                        (ID_CONFIGURACION, ID_NODO_SENSOR, ID_VARIABLE, NOMBRE_VARIABLE, FECHA_CREACION, HORA_CREACION)
                                    VALUES
                                        (UUID(), ?, (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?), ?, CURDATE(), CURTIME())
                                `;

                                pool.query(
                                    queryCrearConfiguracionVariableNodoSensor,
                                    [data.id_nodo_sensor, data.nombre_variable, data.nombre_variable],
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
    consultar_configuracionesVariablesNodoSensor_dinamico: (data, callback) => {

        const queryBaseConsultarConfiguracionVariablesNodoSensor = `
            SELECT
                CVNS.ID_CONFIGURACION,
                NS.ID_NODO_SENSOR,
                NS.LATITUD,
                NS.LONGITUD,
                CVNS.ID_VARIABLE,
                (SELECT 
                    VNS.NOMBRE_VARIABLE 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) NOMBRE_VARIABLE,
                (SELECT 
                    VNS.DETALLES 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) DETALLES_VARIABLE,
                (SELECT 
                    VNS.TIPO_DATO 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) TIPO_DATO_VARIABLE,
                (SELECT 
                    VNS.UNIDAD_MEDIDA 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) UNIDAD_MEDIDA_VARIABLE,
                (SELECT 
                    VNS.RANGO_MIN 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) RANGO_MIN_VARIABLE,
                (SELECT 
                    VNS.RANGO_MAX 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) RANGO_MAX_VARIABLE,
                (SELECT 
                    VNS.FECHA_CREACION 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) FECHA_CREACION_VARIABLE,
                (SELECT 
                    VNS.HORA_CREACION 
                FROM VARIABLES_NODO_SENSOR VNS  
                WHERE ID_VARIABLE = CVNS.ID_VARIABLE) HORA_CREACION_VARIABLE,
                CVNS.FECHA_CREACION FECHA_CREACION_CONFIGURACION,
                CVNS.HORA_CREACION HORA_CREACION_CONFIGURACION
            FROM NODO_SENSOR NS
            INNER JOIN 
                CONFIGURACION_VARIABLES_NODO_SENSOR CVNS 
                ON NS.ID_NODO_SENSOR = CVNS.ID_NODO_SENSOR
        `;

        const queryConsultarConfiguracionVariablesNodoSensorDinamico = consultaDinamica(
            queryBaseConsultarConfiguracionVariablesNodoSensor,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );
        
        pool.query(
            queryConsultarConfiguracionVariablesNodoSensorDinamico,
            [],
            (error, result) => {
               if(error){
                return callback(error, null, false);
               }
               return callback(null, result, true);
            }
        )
    },
    eliminar_configuracionVariablesNodoSensor_ByIDConfiguracion: (data, callback) => {

        const queryConsultarExistenciaConfiguracion = `
            SELECT * FROM CONFIGURACION_VARIABLES_NODO_SENSOR
                WHERE ID_CONFIGURACION = ?
        `;

        pool.query(
            queryConsultarExistenciaConfiguracion,
            [data.id_configuracion],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with ID_CONFIGURACION: ${data.id_configuracion} was not found`, null, false);
                }else if(result.length > 0){

                    const queryEliminarConfiguracionByID = `
                        DELETE FROM CONFIGURACION_VARIABLES_NODO_SENSOR
                            WHERE ID_CONFIGURACION = ? 
                    `;

                    pool.query(
                        queryEliminarConfiguracionByID,
                        [data.id_configuracion],
                        (error, result) => {
                            if(error){
                                return callback(`The register with ID_CONFIGURACION: ${data.id_configuracion} could not be deleted`, null, false);
                            }
                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}