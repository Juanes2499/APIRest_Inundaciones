const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_variables_nodoSensor: (data, callback) => {
        
        const regexNombreVariable = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreVariable.test(data.nombre_variable) === false){
            return callback(`The register with NOMBRE_VARIABLES: ${data.nombre_variable} contains characters not allowed, letters, numbers and underscore are allowed `, '02VNS_01POST_DATA01', null, false);
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

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(result.length > 0){
                    return callback(`The variable: ${data.nombre_variable} already exist`, '02VNS_01POST_GET01', null, false);
                }else if(result.length === 0){
                    
                    const rangoMin = Number(data.rango_min);
                    const rangoMax = Number(data.rango_max);
                    
                    if(rangoMin > rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is greater than maximun rank: ${data.rango_max}`, '02VNS_01POST_DATA02', null, false);
                    }else if(rangoMin === rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is the samse as maximun rank: ${data.rango_max}`, '02VNS_01POST_DATA03', null, false);
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
                                return callback(`The variable: ${data.nombre_variable} could not be created`, '02VNS_01POST_POST04', null, false);
                            }
                            return callback(null, null, result, true);
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

        if(queryConsultarVariablesNodoSensorDinamico.query == null && queryConsultarVariablesNodoSensorDinamico.error === true){
            return callback(queryConsultarVariablesNodoSensorDinamico.message, '02VNS_02GET_GETparameter01', null, false);
        }

        pool.query(
            queryConsultarVariablesNodoSensorDinamico.query,
            [],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for variables sensor node with the parameter(s) set`, '02VNS_02GET_GET02', null, false);
                }

                return callback(null, null, result, true);
            }
        )
    },
    actualizar_variable_ByID: (data, callback) => {

        const regexNombreVariable = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreVariable.test(data.nombre_variable) === false){
            return callback(`The register with NOMBRE_VARIABLES: ${data.nombre_variable} contains characters not allowed, letters, numbers and underscore are allowed `, '02VNS_03PUT_DATA01', null, false);
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

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(result.length === 0){
                    return callback(`The register with ID_VARIABLE: ${data.id_variable} was not found`, '02VNS_03PUT_GET02', null, false);
                }else if(result.length > 0){

                    const rangoMin = Number(data.rango_min);
                    const rangoMax = Number(data.rango_max);
                    
                    if(rangoMin > rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is greater than maximun rank: ${data.rango_max}`, '02VNS_03PUT_DATA03', null, false);
                    }else if(rangoMin === rangoMax){
                        return callback(`The minimun rank: ${data.rango_min} is the samse as maximun rank: ${data.rango_max}`, '02VNS_03PUT_DATA04', null, false);
                    }

                    const queryComprobarExistenciaVariablesAntesActualizar = `
                        SELECT * FROM VARIABLES_NODO_SENSOR
                            WHERE NOMBRE_VARIABLE = ? 
                    `;//Verificar si al actualizar no existe una variable igual

                    pool.query(
                        queryComprobarExistenciaVariablesAntesActualizar,
                        [data.nombre_variable],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                            }

                            const existenciaVariableJson = JSON.parse(JSON.stringify(result))[0] ? JSON.parse(JSON.stringify(result))[0] : {ID_VARIABLE: data.id_variable} ;

                            if(existenciaVariableJson.ID_VARIABLE != data.id_variable){
                                return callback(`The variable with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} already exist in the variable register with NOMBRE_VARIABLE: ${existenciaVariableJson.ID_VARIABLE}`, '02VNS_03PUT_GET05', null, false);
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
                                            return callback(`The register with ID_VARIABLE: ${data.id_variable} could not be updated`, '02VNS_03PUT_PUT06', null, false);
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

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(result.length === 0){
                    if(data.id_variable && data.nombre_variable){
                        return callback(`The register with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, '02VNS_04DELETE_GET01', null, false);
                    }else if(data.id_variable){
                        return callback(`The register with ID_VARIABLE: ${data.id_variable} was not found`, '02VNS_04DELETE_GET02', null, false);
                    }else if(data.nombre_variable){
                        return callback(`The register with NOMBRE_VARIABLE: ${data.nombre_variable} was not found`, '02VNS_04DELETE_GET03', null, false);
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
                                    return callback(`The register with ID_VARIABLE: ${data.id_variable} and NOMBRE_VARIABLE: ${data.nombre_variable} could not be deleted`, '02VNS_04delete_DELETE04', null, false);
                                }else if(data.id_variable){
                                    return callback(`The register with ID_VARIABLE: ${data.id_variable} could not be deleted`, '02VNS_04DELETE_DELETE05', null, false);
                                }else if(data.nombre_variable){
                                    return callback(`The register with NOMBRE_VARIABLE: ${data.nombre_variable} could not be deleted`, '02VNS_04DELETE_DELETE06', null, false);
                                }
                            }
                            
                            return callback(null, null, null, true);
                        }
                    )
                }
            }
        )
    }
}