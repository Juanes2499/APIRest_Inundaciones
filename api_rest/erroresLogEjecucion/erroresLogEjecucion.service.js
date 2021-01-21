const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_erroresLogEjecucion: (data, callback) => {

        data.codigo_error = data.codigo_error.toUpperCase();
        data.modulo = data.modulo.toUpperCase();
        data.metodo = data.metodo.toUpperCase();

        const queryConsultarExisteciaError = `
            SELECT * FROM ERRORES_LOG_EJECUCION
            WHERE 
                CODIGO_ERROR = ? 
                AND URL_ENDPOINT = ? 
                AND MODULO = ? 
                AND ENDPOINT = ? 
                AND METODO = ? 
        `;

        pool.query(
            queryConsultarExisteciaError,
            [data.codigo_error, data.url_endpoint, data.modulo, data.endpoint, data.metodo],
            (error, result) => {

                if(result.length > 0){
                    return callback(`The error type register with CODIGO_ERROR: ${data.codigo_error} and URL_ENDPOINT: ${data.URL_ENDPOINT} and MODULO: ${data.modulo} and ENDPOINT ${data.endpoint} and METODO: ${data.metodo} already exist`, null, false);
                }else if(result.length === 0){

                    const queryInsertarError = `
                        INSERT 
                            INTO ERRORES_LOG_EJECUCION
                            (ID_ERROR, CODIGO_ERROR, URL_ENDPOINT, MODULO, ENDPOINT, METODO, DETALLES, MENSAJE_PANTALLA, FECHA_CREACION, HORA_CREACION)
                        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())
                    `;

                    pool.query(
                        queryInsertarError,
                        [data.codigo_error, data.url_endpoint, data.modulo, data.endpoint, data.metodo, data.detalles, data.mensaje_pantalla],
                        (error, result) => {
                            if(error){
                                return callback(`The error type with CODIGO_ERROR: ${data.codigo_error} could not be created`, null, false);
                            }
                            return callback(null, result, true);
                        }
                    )
                }
            }
        )

    }
}