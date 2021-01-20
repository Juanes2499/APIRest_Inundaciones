const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_variables_nodoSensor: (data, callback) => {
        
        const regexNombreVariable = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreVariable.test(data.nombre_variable) === false){
            return callback(`The register with NOMBRE_VARIABLES: ${data.nombre_variable} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_variable = data.nombre_variable.toUpperCase();
        data.tipo_dato = data.tipo_dato.toUpperCase();

        const queryConsultarExisteciaVariable = `
            SELECT * FROM VARIABLES_NODO_SENSOR 
                WHERE NOMBRE_VARIABLE = ?
        `;

        pool.query(
            queryConsultarExisteciaVariable,
            [data.nombre_variable],
            (error, result) => {
                if(result.length > 0){
                    return callback(`The variable: ${data.nombre_variable} already exist`, null, false);
                }else if(result.length === 0){
                    
                    const rangoMin = Number(data.rango_min);
                    const rangoMax = Number(data.rango_max);
                    
                    if(rangoMin > rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is greater than maximun rank: ${data.rango_max}`, null, false);
                    }else if(rangoMin === rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is the samse as maximun rank: ${data.rango_max}`, null, false);
                    }
                    
                    const queryCrearVariable = `
                        INSERT 
                            INTO VARIABLES_NODO_SENSOR
                            (ID_VARIABLE, NOMBRE_VARIABLE, DETALLES, TIPO_DATO, UNIDAD_MEDIDA, RANGO_MIN, RANGO_MAX, ESTADO, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (UUID(), ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())
                    `;

                    pool.query(
                        queryCrearVariable,
                        [data.nombre_variable, data.detalles, data.tipo_dato, data.unidad_medida, data.rango_min, data.rango_max, data.estado],
                        (error, result) => {
                            if(error){
                                return callback(`The variable: ${data.nombre_variable} could not be created`, null, false);
                            }
                            return callback(null, result, true);
                        }
                    )
                }
            }
        )
    },
    consultar_variablesNodoSensor_dinamico: (data, callback) => {
        
        const queryBaseConsultarVariablesNodoSensor = `
            SELECT 
                ID_VARIABLE,
                NOMBRE_VARIABLE,
                DETALLES,
                TIPO_DATO,
                UNIDAD_MEDIDA,
                RANGO_MIN,
                RANGO_MAX,
                ESTADO,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM VARIABLES_NODO_SENSOR
        `;

        const queryConsultarVariablesNodoSensorDinamico = consultaDinamica(
            queryBaseConsultarVariablesNodoSensor,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );
        
        pool.query(
            queryConsultarVariablesNodoSensorDinamico,
            [],
            (error, result) => {
                if(result.length === 0){
                    return callback(`There is/are no record(s) for sensor node variables with the parameter(s) set`, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    actualizar_variable_ByID: (data, callback) => {

        const regexNombreVariable = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreVariable.test(data.nombre_variable) === false){
            return callback(`The register with NOMBRE_VARIABLES: ${data.nombre_variable} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_variable = data.nombre_variable.toUpperCase();
        data.tipo_dato = data.tipo_dato.toUpperCase();
        
        const queryConsultarVariableNodoSensorByID = `
            SELECT * FROM VARIABLES_NODO_SENSOR
                WHERE ID_VARIABLE = ? 
        `;

        pool.query(
            queryConsultarVariableNodoSensorByID,
            [data.id_variable],
            (error, result) => {

                if(result.length === 0){
                    
                    return callback(`The register with ID_VARIABLE: ${data.id_variable} was not found`, null, false);

                }else if(result.length > 0){

                    const rangoMin = Number(data.rango_min);
                    const rangoMax = Number(data.rango_max);
                    
                    if(rangoMin > rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is greater than maximun rank: ${data.rango_max}`, null, false);
                    }else if(rangoMin === rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is the samse as maximun rank: ${data.rango_max}`, null, false);
                    }

                    const queryComprobarExistenciaVariablesAntesActualizar = `
                        SELECT * FROM VARIABLES_NODO_SENSOR
                            WHERE NOMBRE_VARIABLE = ? 
                    `;//Verificar si al actualizar no existe una variable igual

                    pool.query(
                        queryComprobarExistenciaVariablesAntesActualizar,
                        [data.nombre_variable],
                        (error, result) => {

                            const existenciaVariableJson = JSON.parse(JSON.stringify(result))[0] ? JSON.parse(JSON.stringify(result))[0] : {ID_VARIABLE: data.id_variable} ;

                            if(existenciaVariableJson.ID_VARIABLE != data.id_variable){
                                return callback(`The variable with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} already exist in the variable register with NOMBRE_VARIABLE: ${existenciaVariableJson.ID_VARIABLE}`, null, false);
                            }else if(existenciaVariableJson.ID_VARIABLE === data.id_variable){

                                const queryActualizarVariableByID = `
                                    UPDATE VARIABLES_NODO_SENSOR
                                        SET NOMBRE_VARIABLE = ?,
                                            DETALLES = ?,
                                            TIPO_DATO = ?,
                                            UNIDAD_MEDIDA = ?,
                                            RANGO_MIN = ?,
                                            RANGO_MAX = ?,
                                            ESTADO = ?,
                                            FECHA_ACTUALIZACION = CURDATE(),
                                            HORA_ACTUALIZACION = CURTIME()
                                        WHERE ID_VARIABLE = ?
                                `;
            
                                pool.query(
                                    queryActualizarVariableByID,
                                    [data.nombre_variable, data.detalles, data.tipo_dato, data.unidad_medida, data.rango_min, data.rango_max, data.estado, data.id_variable, data.nombre_variable],
                                    (error, result) => {
                                        if(error){
                                            return callback(`The register with ID_VARIABLE: ${data.id_variable} could not be updated`, null, false);
                                        }
                                        return callback(null, null, true);
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    },
    eliminar_variable_ByID_ByNombreVariable: (data, callback) => {

        if(data.nombre_variable){
            data.nombre_variable = data.nombre_variable.toUpperCase();
        }

        const queryConsultarVariableNodoSensorByIDByNombreVariable = `
            SELECT * FROM VARIABLES_NODO_SENSOR
                WHERE ID_VARIABLE = ? OR NOMBRE_VARIABLE = ?
        `;

        pool.query(
            queryConsultarVariableNodoSensorByIDByNombreVariable,
            [data.id_variable, data.nombre_variable],
            (error, result) => {
                if(result.length === 0){
                    if(data.id_variable && data.nombre_variable){
                        return callback(`The register with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, null, false);
                    }else if(data.id_variable){
                        return callback(`The register with ID_VARIABLE: ${data.id_variable} was not found`, null, false);
                    }else if(data.nombre_variable){
                        return callback(`The register with NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, null, false);
                    }
                }else if(result.length > 0){

                    const queryEliminarVariableByIdByNombreVariable = `
                        DELETE FROM VARIABLES_NODO_SENSOR
                            WHERE ID_VARIABLE = ? OR NOMBRE_VARIABLE = ?
                    `;

                    pool.query(
                        queryEliminarVariableByIdByNombreVariable,
                        [data.id_variable, data.nombre_variable],
                        (error, result) => {
                            if(error){
                                if(data.id_variable && data.nombre_variable){
                                    return callback(`The register with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} could not be deleted`, null, false);
                                }else if(data.id_variable){
                                    return callback(`The register with ID_VARIABLE: ${data.id_variable} could not be deleted`, null, false);
                                }else if(data.nombre_variable){
                                    return callback(`The register with NOMBRE_VARIABLE: ${data.nombre_variable} could not be deleted`, null, false);
                                }
                            }
                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}