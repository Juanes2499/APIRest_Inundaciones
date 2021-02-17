const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_erroresLogEjecucion: (data, callback) => {

        data.codigo_error = data.codigo_error.toUpperCase();
        data.modulo = data.modulo.toUpperCase();
        data.metodo_primario = data.metodo_primario.toUpperCase();
        data.metodo_secundario = data.metodo_secundario.toUpperCase();

        const queryConsultarExisteciaError = `
            SELECT * FROM ERRORES_LOG_EJECUCION
            WHERE 
                CODIGO_ERROR = ? 
                AND URL_ENDPOINT = ? 
                AND MODULO = ? 
                AND ENDPOINT = ? 
                AND METODO_PRIMARIO = ?
                AND METODO_SECUNDARIO = ?  
        `;

        pool.query(
            queryConsultarExisteciaError,
            [data.codigo_error, data.url_endpoint, data.modulo, data.endpoint, data.metodo_primario, data.metodo_secundario],
            (error, result) => {

                if(result.length > 0){
                    return callback(`The error type register with CODIGO_ERROR: ${data.codigo_error} and URL_ENDPOINT: ${data.URL_ENDPOINT} and MODULO: ${data.modulo} and ENDPOINT ${data.endpoint} and METODO: ${data.metodo} already exist`, '06ELE_01POST_GET01', null, false);
                }else if(result.length === 0){

                    const queryInsertarError = `
                        INSERT 
                            INTO ERRORES_LOG_EJECUCION
                            (ID_ERROR, CODIGO_ERROR, URL_ENDPOINT, MODULO, ENDPOINT, METODO_PRIMARIO, METODO_SECUNDARIO, DETALLES, MENSAJE_PANTALLA, FECHA_CREACION, HORA_CREACION)
                        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())
                    `;

                    pool.query(
                        queryInsertarError,
                        [data.codigo_error, data.url_endpoint, data.modulo, data.endpoint, data.metodo_primario, data.metodo_secundario, data.detalles, data.mensaje_pantalla],
                        (error, result) => {
                            if(error){
                                return callback(`The error type with CODIGO_ERROR: ${data.codigo_error} could not be created`, '06ELE_01POST_POST02', null, false);
                            }
                            return callback(null, result, true);
                        }
                    )
                }
            }
        )
    },
    consultar_erroresLogEjecucion: (data, callback) => {

        const queryBaseConsultarErroresLogEje = `
            SELECT
                ID_ERROR,
                CODIGO_ERROR,
                URL_ENDPOINT,
                MODULO,
                ENDPOINT,
                METODO_PRIMARIO,
                METODO_SECUNDARIO,
                DETALLES,
                MENSAJE_PANTALLA,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM ERRORES_LOG_EJECUCION
            ORDER BY FECHA_CREACION  DESC, HORA_CREACION DESC
        `;

        const queryConsultarErroresLogEjecucionDinamico = consultaDinamica(
            queryBaseConsultarErroresLogEje,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarErroresLogEjecucionDinamico.query == null && queryConsultarErroresLogEjecucionDinamico.error === true){
            return callback(queryConsultarErroresLogEjecucionDinamico.message, '06ELE_02GET_GETPARAMETER01', null, false);
        }

        pool.query(
            queryConsultarErroresLogEjecucionDinamico.query,
            [],
            (error, result) => {

                if(result.length === 0){
                    return callback(`There is/are no record(s) for log execution log with the parameter(s) set`, '06ELE_02GET_GET02', null, false);
                }else if (result.length > 0){
                    return callback(null, null, result, true);
                }
            }
        )
    },
    actualizar_errorLogEjecucion_ById: (data, callback) => {

        const queryConsultarExistenciaError = `
            SELECT * FROM ERRORES_LOG_EJECUCION
                WHERE ID_ERROR = ? 
        `;

        pool.query(
            queryConsultarExistenciaError,
            [data.id_error],
            (error, result) => {
                
                if(result.length === 0){
                    return callback(`The register with ID_ERROR: ${data.id_regla} was not found`, '06ELE_03PUT_GET01', null, false);
                }else if (result.length > 0){

                    const queryComprobarExistenciaError = `
                        SELECT * FROM ERRORES_LOG_EJECUCION
                        WHERE 
                            CODIGO_ERROR = ? 
                            AND URL_ENDPOINT = ? 
                            AND MODULO = ? 
                            AND ENDPOINT = ? 
                            AND METODO_PRIMARIO = ?
                            AND METODO_SECUNDARIO = ? 
                    `; //Verificar si al actualizar no existe una regla igual

                    pool.query(
                        queryComprobarExistenciaError,
                        [data.codigo_error, data.url_endpoint, data.modulo, data.endpoint, data.metodo_primario, data.metodo_secundario],
                        (error, result) => {

                            const existenciaErrorJson = JSON.parse(JSON.stringify(result))[0] ? JSON.parse(JSON.stringify(result))[0] : {ID_REGLA: data.id_regla} ;

                            if(existenciaErrorJson.ID_REGLA != data.id_regla){
                                return callback(`The error type with ID_ERROR: ${data.id_error} AND CODIGO_ERROR: ${data.codigo_error} already exist in the error typer with ID_ERROR: ${existenciaReglaJson.existenciaErrorJson}`, '06ELE_03PUT_GET02', null, false);
                            }else if (existenciaErrorJson.ID_REGLA === data.id_regla){

                                const queryActualizarRegla = `
                                    UPDATE ERRORES_LOG_EJECUCION
                                        SET 
                                            CODIGO_ERROR = ?, 
                                            URL_ENDPOINT = ?, 
                                            MODULO = ?, 
                                            ENDPOINT = ?, 
                                            METODO_PRIMARIO = ?, 
                                            METODO_SECUNDARIO = ?, 
                                            DETALLES = ?, 
                                            MENSAJE_PANTALLA = ?, 
                                            FECHA_ACTUALIZACION = CURDATE(), 
                                            HORA_ACTUALIZACION =  CURTIME()
                                        WHERE ID_ERROR = ?
                                `;

                                pool.query(
                                    queryActualizarRegla,
                                    [data.codigo_error, data.url_endpoint, data.modulo, data.endpoint, data.metodo_primario, data.metodo_secundario, data.detalles, data.mensaje_pantalla, data.id_error],
                                    (error, result) => {

                                        if(error){
                                            return callback(`The register with ID_ERROR: ${data.id_error} could not be updated`, '06ELE_03PUT_PUT03', null, false);
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
    eliminar_errorLogEejecucion_byId: (data, callback) => {

        const queryConsultarExistenciaError = `
            SELECT * FROM ERRORES_LOG_EJECUCION
                WHERE ID_ERROR = ? 
        `;

        pool.query(
            queryConsultarExistenciaError,
            [data.id_error],
            (error, result) => {
                
                if(result.length === 0){
                    return callback(`The register with ID_ERROR: ${data.id_error} was not found`, '06ELE_04DELETE_GET01', null, false);
                }else if(result.length > 0){

                    const queryEliminarReglaNodoSensor = `
                        DELETE FROM ERRORES_LOG_EJECUCION
                            WHERE ID_ERROR = ? 
                    `;

                    pool.query(
                        queryEliminarReglaNodoSensor,
                        [data.id_error],
                        (error, result) => {

                            if(error){
                                return callback(`The register with ID_ERROR: ${data.id_regla} could not be deleted`, '06ELE_04DELETE_DELETE02', null, false);
                            }
                            return callback(null, null, null, true);
                        }
                    )
                }
            }
        )
    }
}