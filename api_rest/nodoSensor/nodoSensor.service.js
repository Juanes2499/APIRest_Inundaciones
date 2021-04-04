const createAxiosInstanceAuth = require("../../shared/createAxiosInstanceAuth");
const pool = require("../../config/database");
const crypto = require("crypto");
const base64url = require("base64url");
const consultaDinamica = require("../../shared/consultaDinamica");
const axios = require("axios");
var Request = require("request");

module.exports={
    test: (data, token, callback) => {
        Request.post({
            "headers": { 'Authorization': `Bearer ${token}` },
            "url": "http://127.0.0.1:3020/api/dispositivos/get",
            "json": data
        }, (error, response, body) => {
            if(error) {
                console.log(error)
            }
            console.log(response)
            console.log(response.body)
        });
    },
    crear_nodoSensor: (data, callback) => {

        const token = base64url(crypto.randomBytes(200));

        pool.query(
            `
            INSERT 
                INTO NODO_SENSOR 
                (ID_NODO_SENSOR, TOKEN, LATITUD, LONGITUD, DISPOSITIVO_ADQUISICION, ESTADO, FECHA_CREACION, HORA_CREACION)
            VALUES 
                (UUID(), ?, ?, ?, ?, ?, CURDATE(), CURTIME())
            `,
            [token, data.latitud, data.longitud, data.dispositivo_adquisicion, data.estado],
            (error, result) => {
                if(error){
                    return callback(`The node sensor could not be created`, '01NS_01POST_POST01', null, false);
                }
                return callback(null, null, result, true);
            }
        )
    },
    consultar_nodoSensor_dinamico: (data, callback) => {
        
        const queryBaseConsultarNodoSensor = `
            SELECT 
                ID_NODO_SENSOR,
                TOKEN,
                LATITUD,
                LONGITUD,
                DISPOSITIVO_ADQUISICION,
                ESTADO,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM NODO_SENSOR
        `;

        const queryConsultarNodoSensorDinamico = consultaDinamica(
            queryBaseConsultarNodoSensor,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarNodoSensorDinamico.query == null && queryConsultarNodoSensorDinamico.error === true){
            return callback(queryConsultarNodoSensorDinamico.message, '01NS_02GET_GETPARAMETERS01', null, false);
        }

        pool.query(
            queryConsultarNodoSensorDinamico.query,
            [],
            (error, result) => {
                if(result.length === 0){
                    return callback(`There is/are no record(s) for sensor node with the parameter(s) set`, '01NS_02GET_GET02', null, false);
                }
                return callback(null, null, result, true);
            }
        )
    },
    actualizar_nodoSensor: (data, callback) => {
        pool.query(
            `
            SELECT * FROM NODO_SENSOR
                WHERE ID_NODO_SENSOR = ?`,
            [data.id_nodo_sensor],
            (error,result) => {
                if(result.length === 0){
                    return callback(`The register with ID: ${data.id_nodo_sensor} was not found`, '01NS_03PUT_GET01', null, false);
                }else if (result.length > 0){
                    pool.query(
                        `
                        UPDATE NODO_SENSOR
                            SET LATITUD = ?,
                                LONGITUD = ?,
                                DISPOSITIVO_ADQUISICION = ?,
                                ESTADO = ?,
                                FECHA_ACTUALIZACION = CURDATE(),
                                HORA_ACTUALIZACION = CURTIME() 
                            WHERE ID_NODO_SENSOR = ?`,
                        [data.latitud, data.longitud, data.dispositivo_adquisicion, data.estado, data.id_nodo_sensor],
                        (error, result) => {
                            console.log(result);
                            if(error){
                                return callback(`The register with ID: ${data.id_nodo_sensor} could not be updated`, '01NS_03PUT_PUT02', null, false);
                            }
                            return callback(null, null, null, true);
                        }
                    )
                }
            }
        )
    },
    eliminar_nodoSensor: (data, callback) => {
        pool.query(
            `SELECT * FROM NODO_SENSOR
                WHERE ID_NODO_SENSOR = ?`,
            [data.id_nodo_sensor],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with ID: ${data.id_nodo_sensor} was not found`, '01NS_04DELETE_GET01', null, false);
                } else if(result.length > 0){
                    pool.query(
                        `
                        DELETE FROM NODO_SENSOR
                            WHERE ID_NODO_SENSOR = ?`,
                        [data.id_nodo_sensor],
                        (error, result) => {
                            if(error){
                                return callback(`The register with ID: ${data.id_nodo_sensor} could not be deleted`, '01NS_04DELETE_DELETE02', null, false);
                            }
                            return callback(null, null, true)
                        }
                    )
                }
            }
        )
    }
}