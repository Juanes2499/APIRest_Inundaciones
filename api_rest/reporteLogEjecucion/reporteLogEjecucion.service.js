const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

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
    consultar_ReporteLogEjecucion_dinamico: (data, callback) => {

        const queryBaseConsultarReporteLogEje = `
            SELECT
                ID_REPORTE,
                CODIGO_ERROR,
                URL_ENDPOINT,
                MODULO,
                ENDPOINT,
                METODO_PRIMARIO,
                METODO_SECUNDARIO,
                MENSAJE_RETORNADO,
                FECHA_CREACION,
                HORA_CREACION
            FROM REPORTE_LOG_EJECUCION
            ORDER BY FECHA_CREACION  DESC, HORA_CREACION DESC
        `;

        const queryConsultarReporteLogEjecucionDinamico = consultaDinamica(
            queryBaseConsultarReporteLogEje,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarReporteLogEjecucionDinamico.query == null && queryConsultarReporteLogEjecucionDinamico.error === true){
            return callback(queryConsultarReporteLogEjecucionDinamico.message, '07RLE_02GET_GETPARAMETER01', null, false);
        }

        pool.query(
            queryConsultarReporteLogEjecucionDinamico.query,
            [],
            (error, result) => {

                if(result.length === 0){
                    return callback(`There is/are no record(s) for log execution report with the parameter(s) set`, '07RLE_02GET_GET02', null, false);
                }else if (result.length > 0){
                    return callback(null, null, result, true);
                }
            }
        )
    }
}