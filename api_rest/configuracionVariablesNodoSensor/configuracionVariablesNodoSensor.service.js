const pool = require("../../config/database");

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
                                        (ID_NODO_SENSOR, ID_VARIABLE, NOMBRE_VARIABLE, FECHA_CREACION, HORA_CREACION)
                                    VALUES
                                        (?, (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?), ?, CURDATE(), CURTIME())
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
    consultar_configuracionesVariablesNodoSensor: (callback) => {

        const queryConsultarConfiguracionVariablesNodoSensor = `
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
        
        pool.query(
            queryConsultarConfiguracionVariablesNodoSensor,
            [],
            (error, result) => {
               if(error){
                return callback(error, null, false);
               }
               return callback(null, result, true);
            }
        )
    },
    consultar_configuracionVariablesNodoSensor_ByNombreVariable: (data, callback) => {

        data.nombre_variable = data.nombre_variable.toUpperCase();

        const queryConsultarConfiguracionVariableByNombreVariable = `
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
            WHERE CVNS.ID_VARIABLE = (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?)    
        `;

        pool.query(
            queryConsultarConfiguracionVariableByNombreVariable,
            [data.nombre_variable],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The registers with NOMBRE_VARIABLE: ${data.nombre_variable} were not found`, null, false);
                }else if(result.length > 0){
                    return callback(null, result, true);
                }
            }
        )
    },
    consultar_configuracionVariablesNodoSensor_ByIDConfiguracion_ByIDNodoSensor_ByIDVariable: (data, callback) => {

        const queryConsultarConfiguracionVariableByIdConfiguracion_ByIDNodoSensor_ByIDVariable = `
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
                WHERE CVNS.ID_CONFIGURACION = ? OR NS.ID_NODO_SENSOR = ? OR CVNS.ID_VARIABLE = ?;    
        `;

        pool.query(
            queryConsultarConfiguracionVariableByIdConfiguracion_ByIDNodoSensor_ByIDVariable,
            [data.id_configuracion, data.id_nodo_sensor,data.id_variable],
            (error, result) => {
                
                if(result.length === 0){

                    const dataArray = [0,0,0];
                    dataArray[0] = data.id_configuracion ? data.id_configuracion : 0;
                    dataArray[1] = data.id_nodo_sensor ? data.id_nodo_sensor : 0;
                    dataArray[2] = data.id_variable ? dataArray.id_variable : 0;
    
                    const idsNombres = ["id_configuracion", "id_nodo_sensor", "id_variable"];
                    const idsValidacion = [false, false, false];
                    idsValidacion[0] = data.id_configuracion ? true : false;
                    idsValidacion[1] = data.id_nodo_sensor ? true : false;
                    idsValidacion[2] = data.id_variable ? true : false;
    
                    const posicionIDS = []
    
                    for(var i = 0; i<idsValidacion.length; i++){
                        posicionIDS[i] = idsValidacion[i] === true ? i : null;
                    }
                    
                    const errorArray = ["The register with"];
    
                    (posicionIDS.filter(x => x != null)).forEach(x => {
                        errorArray.push(`${idsNombres[x].toUpperCase()}: ${dataArray[x]}`);
                    })
    
                    const msgError = `${errorArray.toString().replace(",", " ").replace(",", " and ")} were not found`;

                    return callback(msgError, null, false);
                }else if(result.length > 0){
                    return callback(null, result, true);
                }
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