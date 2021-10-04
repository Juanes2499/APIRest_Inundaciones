const pool = require("../../config/database");
const crypto = require("crypto");
const base64url = require("base64url");
const consultaDinamica = require("../../shared/consultaDinamica");
const { sign } = require("jsonwebtoken");
const CreatorUUID = require('uuid');
const sendEmail = require("../../shared/sendEmail");

module.exports={
    crear_nodoSensor: (data, callback) => {

        data.email_responsable = data.email_responsable.toLowerCase();
        
        const uuid = CreatorUUID.v4();

        const payloald = {
            id_dispositivo: uuid,
            marca: data.marca,
            referencia: data.referencia,
            latitud: data.latitud,
            longitud: data.longitud,
            email_responsable: data.email_responsable,
        }
        
        const keyDevices = process.env.TOKEN_KEY_DEVICES.toString();
        const tokenDispositivo = sign(payloald, keyDevices, {
            //expiresIn: expiresInDispositivo,
        }); 

        const queryCrearDispositivos = `
            INSERT INTO NODO_SENSOR (
                ID_NODO_SENSOR, 
                TOKEN, 
                MARCA,
                REFERENCIA,
                LATITUD, 
                LONGITUD, 
                EMAIL_RESPONSABLE,
                FECHA_CREACION, 
                HORA_CREACION
            ) VALUES (
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
            queryCrearDispositivos,
            [uuid, tokenDispositivo, data.marca, data.referencia, data.latitud, data.longitud, data.email_responsable],
            (error, result) => {
                
                if(error){
                    return callback(`The node sensor could not be created`, '01NS_01POST_POST01', null, false);
                }else{
                    sendEmail(
                        data.email_responsable,
                        `Creación dispositivo ResCity ${uuid}`,
                        `
                            <p><h1>Creación dispositivo ResCity ${uuid}</h1></p>
                            <br>
                            <p>Apreciado usuario ResCity, se ha registrado un dispositivo bajo su responsabilidad.</p>
                            <p>Para que el dispositivo pueda enviar datos hacía la plataforma debe usar el siguiente token de autenticación.</p> 
                            <p><b>Token: </b>${tokenDispositivo}</p>
                            <p>Por favor evitar compartir este token de seguridad, en caso de perdida del token puede solicitar actualización del mismo.</p>
                            <p>La vigencia del token es de 1 año, después de este tiempo es necesario actualizar el token.</p>
                            <br>
                            <br>
                            <p>Muchas gracias por su atención.</p>
                            <br>
                            <br>
                            <p><h3>ResCity</h3></p>
                            <p><h4>Módulo Sensores</h4></p>
                            <p><h4>Universidad Autónoma de Occidente de Cali</h4></p>
                            <p><img src="${process.env.IMG_CORREO}" width="180" height="100"/></p>
                            <br>
                            <p><h6>Si usted ha recibido este mensaje por error, por favor hacer caso omiso.</h6></p>
                        `,
                        (result) => {
                            if(result === false) {
                                return callback(`The email could not be sent, but the sensor node was registered`, '01NS_01POST_POST02', null, false);
                            }else{
                                return callback(null, null, null, true);
                            }
                        }
                    )
                }
            }
        )
    },
    consultar_nodoSensor_dinamico: (data, callback) => {
        
        const queryBaseConsultarNodoSensor = `
            SELECT 
                ID_NODO_SENSOR,
                TOKEN,
                MARCA,
                REFERENCIA,
                LATITUD,
                LONGITUD,
                EMAIL_RESPONSABLE,
                DISPOSITIVO_ACTIVO,
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

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

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
                    const queryActulizarNodoSensor = `
                        UPDATE NODO_SENSOR
                            SET 
                                MARCA = ?,
                                REFERENCIA = ?,
                                LATITUD = ?,
                                LONGITUD = ?,
                                EMAIL_RESPONSABLE = ?,
                                DISPOSITIVO_ACTIVO = ?,
                                FECHA_ACTUALIZACION = CURDATE(),
                                HORA_ACTUALIZACION = CURTIME()
                        WHERE ID_NODO_SENSOR = ?
                    `;

                    pool.query(
                        queryActulizarNodoSensor,
                        [data.marca, data.referencia, data.latitud, data.longitud, data.email_responsable, data.dispositivo_activo, data.id_nodo_sensor],
                        (error, result) => {

                            if(error){
                                return callback(`The register with ID: ${data.id_nodo_sensor} could not be updated`, '01NS_03PUT_PUT02', null, false);
                            }

                            sendEmail(
                                data.email_responsable,
                                `Actualización Nodo Sensor ${data.id_nodo_sensor}`,
                                `
                                    <p><h1>Actualización Nodo Sensor ${data.id_nodo_sensor}</h1></p>
                                    <br>
                                    <p>Apreciado usuario ResCity, se ha actualizado el nodo sensor con la siguiente configuración</p>
                                    <p><b>Marca: </b>${data.marca}</p>
                                    <p><b>Referencia: </b>${data.referencia}</p>
                                    <p><b>Latitud: </b>${data.latitud}</p>
                                    <p><b>Longitud: </b>${data.longitud}</p>
                                    <p><b>Estado: </b>${data.dispositivo_activo}</p>
                                    <p><b>Correo responsable: </b>${data.email_responsable}</p>
                                    <br>
                                    <p>Si usted no ha actulizado el dispositivo, por favor comunicarse con el área TI.</p>
                                    <br>
                                    <br>
                                    <p>Muchas gracias por su atención.</p>
                                    <br>
                                    <br>
                                    <p><h3>ResCity</h3></p>
                                    <p><h4>Módulo Sensores</h4></p>
                                    <p><h4>Universidad Autónoma de Occidente de Cali</h4></p>
                                    <p><img src="${process.env.IMG_CORREO}" width="180" height="100"/></p>
                                    <br>
                                    <p><h6>Si usted ha recibido este mensaje por error, por favor hacer caso omiso.</h6></p>
                                `,
                                (result) => {
                                    if(result === false) {
                                        return callback(`The email could not be sent, but the sensor node was updated`, '01NS_03PUT_PUT03', null, false);
                                    }else{
                                        return callback(null, null, null, true);
                                    }
                                }
                            )
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

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                const resultDeviceToJson = JSON.parse(JSON.stringify(result))[0]

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

                            sendEmail(
                                resultDeviceToJson.EMAIL_RESPONSABLE,
                                `Eliminación Nodo Sensor ${data.id_nodo_sensor}`,
                                `
                                    <p><h1>Eliminación Nodo Sensor ${data.id_nodo_sensor}</h1></p>
                                    <br>
                                    <p>Apreciado usuario ResCity, se ha eliminado el nodo sensor ${data.id_nodo_sensor}.</p>
                                    <br>
                                    <p>Si usted no ha eliminado el dispositivo, por favor comunicarse con el área TI.</p>
                                    <br>
                                    <br>
                                    <p>Muchas gracias por su atención.</p>
                                    <br>
                                    <br>
                                    <p><h3>ResCity</h3></p>
                                    <p><h4>Módulo Sensores</h4></p>
                                    <p><h4>Universidad Autónoma de Occidente de Cali</h4></p>
                                    <p><img src="${process.env.IMG_CORREO}" width="180" height="100"/></p>
                                    <br>
                                    <p><h6>Si usted ha recibido este mensaje por error, por favor hacer caso omiso.</h6></p>
                                `,
                                (result) => {
                                    if(result === false) {
                                        return callback(`The email could not be sent, but the sensor node was deleted`, '01NS_04DELETE_DELETE03', null, false);
                                    }else{
                                        return callback(null, null, null, true);
                                    }
                                }
                            )
                        }
                    )
                }
            }
        )
    },
    actualizar_token_nodoSensor: (data, callback)=>{

        data.email_responsable = data.email_responsable.toLowerCase();


        let queryConsutarExistenciaDispositivo = `
            SELECT * FROM NODO_SENSOR
            WHERE ID_NODO_SENSOR = ? AND EMAIL_RESPONSABLE = ?
        `;
            
        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_nodo_sensor, data.email_responsable],
            (error, resultDevice) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(resultDevice.length === 0){

                    return callback(`The device with ID: ${data.id_nodo_sensor} was not found`, '01NS_05PUT_GET01', null, false);

                }else if (resultDevice.length > 0){

                    const resultDeviceToJson = JSON.parse(JSON.stringify(resultDevice))[0]

                    const key = process.env.TOKEN_KEY_DEVICES.toString();

                    const payloald = {
                        id_dispositivo: data.id_nodo_sensor,
                        marca: resultDeviceToJson.MARCA,
                        referencia: resultDeviceToJson.REFERENCIA,
                        latitud: resultDeviceToJson.LATITUD,
                        longitud: resultDeviceToJson.LONGITUD,
                        email_responsable: data.email_responsable,
                    }
                    
                    const TokenDispositivo = sign(payloald, key, {
                        //expiresIn: expiresInDispositivo,
                    });

                    let queryActualizarTokenDispositivo = `
                        UPDATE NODO_SENSOR
                            SET 
                                TOKEN = ?,
                                FECHA_ACT_TOKEN = CURDATE(),
                                HORA_ACT_TOKEN = CURDATE()
                        WHERE ID_NODO_SENSOR = ? AND EMAIL_RESPONSABLE = ? 
                    `; 

                    pool.query(
                        queryActualizarTokenDispositivo,
                        [
                            TokenDispositivo,
                            data.id_nodo_sensor,
                            data.email_responsable
                        ],
                        (error, result) =>{

                            if(error){
                                return callback(`The token of the sensor node with ID ${data.id_nodo_sensor} could not be updated`, '01NS_05PUT_PUT02', null, false)
                            }else{

                                sendEmail(
                                    data.email_responsable,
                                    `Actualización token Nodo Sensor ${data.id_nodo_sensor}`,
                                    `
                                        <p><h1>Actualización token Nodo Sensor ${data.id_nodo_sensor}</h1></p>
                                        <br>
                                        <p>Apreciado usuario ResCity, se ha actulizado el token del dipositivo.</p>
                                        <p>Para que el dispositivo pueda enviar datos hacía la plataforma debe usar el siguiente token de autenticación.</p> 
                                        <p><b>Token: </b>${TokenDispositivo}</p>
                                        <p>Por favor evitar compartir este token de seguridad, en caso de perdida del token puede solicitar actulización del mismo.</p>
                                        <p>La vigencia del token es de 1 año, después de este tiempo es necesario actualizar el token.</p>
                                        <br>
                                        <br>
                                        <p>Muchas gracias por su atención.</p>
                                        <br>
                                        <br>
                                        <p><h3>ResCity</h3></p>
                                        <p><h4>Módulo Sensores</h4></p>
                                        <p><h4>Universidad Autónoma de Occidente de Cali</h4></p>
                                        <p><img src="${process.env.IMG_CORREO}" width="180" height="100"/></p>
                                        <br>
                                        <p><h6>Si usted ha recibido este mensaje por error, por favor hacer caso omiso.</h6></p>
                                    `,
                                    (result) => {
                                        if(result === false) {
                                            return callback(`The email could not be sent, but the sensor node token was updated`, '01NS_05PUT_PUT03', null, false);
                                        }else{
                                            return callback(null, null, null, true);
                                        }
                                    }
                                )
                            }
                        }
                    );
                }
            }
        )
    },
}