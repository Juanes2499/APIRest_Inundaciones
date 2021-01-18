const pool = require("../../config/database");

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
                            (NOMBRE_VARIABLE, DETALLES, TIPO_DATO, UNIDAD_MEDIDA, RANGO_MIN, RANGO_MAX, ESTADO, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())
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
    consultar_variables_nodoSensor: (callback) => {
        
        const queryConsultarVariablesNodoSensor = `
            SELECT * FROM VARIABLES_NODO_SENSOR
        `;

        pool.query(
            queryConsultarVariablesNodoSensor,
            [],
            (error, result) => {
                if(result.length === 0){
                    return callback(`There are no records for sensor node variables`, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    consultar_variable_ByNombreVariable: (data, callback) => {
        data.nombre_variable = data.nombre_variable.toUpperCase();

        const queryConsultarVariableNodoSensorByNombreVariable = `
            SELECT * FROM VARIABLES_NODO_SENSOR
                WHERE NOMBRE_VARIABLE = ? 
        `;

        pool.query(
            queryConsultarVariableNodoSensorByNombreVariable,
            [data.nombre_variable],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with nombre_variable: ${data.nombre_variable} was not found`, null, false);
                }else if(result.length > 0){
                    return callback(null, result, true);
                }
            }
        )
    },
    actualizar_variable_ByID_ByNombreVariable: (data, callback) => {

        const regexNombreVariable = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreVariable.test(data.nombre_variable) === false){
            return callback(`The register with NOMBRE_VARIABLES: ${data.nombre_variable} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_variable = data.nombre_variable.toUpperCase();
        data.tipo_dato = data.tipo_dato.toUpperCase();
        
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

                    const rangoMin = Number(data.rango_min);
                    const rangoMax = Number(data.rango_max);
                    
                    if(rangoMin > rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is greater than maximun rank: ${data.rango_max}`, null, false);
                    }else if(rangoMin === rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is the samse as maximun rank: ${data.rango_max}`, null, false);
                    }

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
                            WHERE ID_VARIABLE = ? OR NOMBRE_VARIABLE = ? 
                    `;

                    pool.query(
                        queryActualizarVariableByID,
                        [data.nombre_variable, data.detalles, data.tipo_dato, data.unidad_medida, data.rango_min, data.rango_max, data.estado, data.id_variable, data.nombre_variable],
                        (error, result) => {
                            if(error){

                                if(data.id_variable && data.nombre_variable){
                                    return callback(`The register with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} could not be updated`, null, false);
                                }else if(data.id_variable){
                                    return callback(`The register with ID_VARIABLE: ${data.id_variable} could not be updated`, null, false);
                                }else if(data.nombre_variable){
                                    return callback(`The register with NOMBRE_VARIABLE: ${data.nombre_variable} could not be updated`, null, false);
                                }

                            }
                            return callback(null, null, true);
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