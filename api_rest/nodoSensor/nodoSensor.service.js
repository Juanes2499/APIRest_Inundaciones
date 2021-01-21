const pool = require("../../config/database");
const crypto = require("crypto");
const base64url = require("base64url");

module.exports={
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
    consultar_nodoSensor: (callback) => {
        pool.query(
            `SELECT * FROM NODO_SENSOR`,
            [],
            (error, result) => {
                if(error){
                    return callback(error, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    consultar_nodoSensor_byID: (data, callback) => {
        pool.query(
            `
            SELECT * FROM NODO_SENSOR
                WHERE ID_NODO_SENSOR = ?`,
            [data.id_nodo_sensor],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with ID: ${data.id_nodo_sensor} was not found`, null, false);
                } else if(result.length > 0){
                    return callback(null, result, true);
                }
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