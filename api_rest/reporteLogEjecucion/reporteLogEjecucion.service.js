const pool = require("../../config/database");

module.exports={
    crear_reporteLogEjecucion: (errorData, callback) => {

        const queryConsultarError = `
            SELECT * FROM ERRORES_LOG_EJECUCION WHERE CODIGO_ERROR = ?
        `;

        pool.query(
            queryConsultarError,
            [errorData.codigo_error],
            (error, result) => {

                if(result.length === 0){
                    return callback(null, null, null, false);
                }else if (result.length > 0 ){

                    const errorRes = JSON.parse(JSON.stringify(result))[0];

                    const queryInsertarReporteLogEjecucion = `
                        INSERT 
                            INTO REPORTE_LOG_EJECUCION
                            (ID_REPORTE, CODIGO_ERROR, URL_ENDPOINT, MODULO, ENDPOINT, METODO_PRIMARIO, METODO_SECUNDARIO, MENSAJE_RETORNADO, FECHA_CREACION, HORA_CREACION)
                        VALUES (
                            UUID(),
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            CURDATE(), 
                            CURTIME()
                        )
                    `;
            
                    pool.query(
                        queryInsertarReporteLogEjecucion,
                        [errorData.codigo_error, errorRes.URL_ENDPOINT, errorRes.MODULO, errorRes.ENDPOINT, errorRes.METODO_PRIMARIO, errorRes.METODO_SECUNDARIO, errorData.mensaje_retornado],
                        (error, result) => {

                            if(error){
                                return callback(null, null, null, false);
                            }
                            return callback(null, null, result, true);
                        }
                    )

                }
            }
        )
    },
}