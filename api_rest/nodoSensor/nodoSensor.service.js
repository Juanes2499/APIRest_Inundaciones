
const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");
const CreatorUUID = require('uuid');
var Request = require("request");
const { sign } = require("jsonwebtoken");
const {validarExistenciaDispositivoAutenticacion} = require('../../shared/helper');

module.exports={
    test: (data, token, callback) => {

        console.log(data)

        // Request.post("http://127.0.0.1:3020/api/dispositivos/get",  (error, response, body) => {
        //     if(error) {
        //         //return console.dir(error);
        //         console.log(error)
        //     }
        //     console.log(response)
        //     console.log(response.body)
        //     //console.dir(JSON.parse(body));
        // });

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
    crear_nodoSensor: (data, token, callback) => {
    
        data.email_responsable = data.email_responsable.toLowerCase();
        
        const DateTime = new Date();
        const date = `${DateTime.getFullYear()}-${(DateTime.getMonth()+1)}-${DateTime.getDate()}`
        const time = `${DateTime.getHours()}:${DateTime.getMinutes()}:${DateTime.getSeconds()}`;

        const uuid = CreatorUUID.v4();

        const keyDevices = process.env.TOKEN_KEY_DEVICES.toString();
        const expiresInDispositivo = parseInt(process.env.TOKEN_EXPIRE_IN_DISPOSITIVO);
        
        
        const payloald = {
            id_dispositivo: uuid,
            marca: data.marca,
            referencia: data.referencia,
            latitud: data.latitud,
            longitud: data.longitud,
            nombre_microservicio: data.nombre_microservicio,
            email_responsable: data.email_responsable,
        }
        
        const tokenDispositivo = sign(payloald, keyDevices, {
            expiresIn: expiresInDispositivo,
        }); 
        
        data.microservicio_interes = process.env.MICROSERVICIO_INTERES;
        data.modulo_interes = process.env.MODULOS_INTERES;
        data.uuid = uuid;
        data.token = tokenDispositivo;
        data.fecha_creacion = date;
        data.hora_creacion = time;        

        Request.post({
            "headers": { 'Authorization': `Bearer ${token}` },
            "url": `http://${process.env.HOST_AUTH}/api/dispositivos`,
            "json": data
        }, (error, response, body) => {


            if(error) {

                return callback(`The new device could not be senden to the Core platform`, '01NS_01POST_POST01', null, false);

            }else if(response.body.success === true){

                const queryCrearDispositivos = `
                    INSERT INTO NODO_SENSOR (
                        ID_NODO_SENSOR, 
                        TOKEN, 
                        MARCA,
                        REFERENCIA,
                        LATITUD, 
                        LONGITUD, 
                        NOMBRE_MICROSERVICIO,
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
                        ?,
                        ?,
                        ?
                    )
                `;
        
                pool.query(
                    queryCrearDispositivos,
                    [uuid, tokenDispositivo, data.marca, data.referencia, data.latitud, data.longitud, data.nombre_microservicio, data.email_responsable, date, time],
                    (error, result) => {
                        if(error){
                            return callback(`The node sensor could not be created`, '01NS_01POST_POST01', null, false);
                        }else{
                            return callback(null, null, result, true);
                        }
                    }
                )
            }
        });
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
                if(result.length === 0){
                    return callback(`There is/are no record(s) for sensor node with the parameter(s) set`, '01NS_02GET_GET02', null, false);
                }
                return callback(null, null, result, true);
            }
        )
    },
    actualizar_nodoSensor: (data, token, callback) => {

        const dataConsulta = {
            microservicio_interes: process.env.MICROSERVICIO_INTERES,
            modulo_interes: process.env.MODULOS_INTERES,
            seleccionar:"ID_DISPOSITIVO",
            condicion:{
                ID_VARIABLE: {
                    conector_logico:"",
                    operador: "=",
                    valor_condicion: data.id_nodo_sensor
                }
            },
            agrupar:"",
            ordenar:""
        } 

        validarExistenciaDispositivoAutenticacion(dataConsulta, token, (err, state) => {
            if(state === true){

                const queryConsultarNodoSensor =  `
                    SELECT * FROM NODO_SENSOR
                        WHERE ID_NODO_SENSOR = ?
                `;

                pool.query(
                    queryConsultarNodoSensor,
                    [data.id_nodo_sensor],
                    (error,result) => {

                        if (error){
                            return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                        }

                        if(result.length === 0){
                            return callback(`The register with ID: ${data.id_nodo_sensor} was not found`, '01NS_03PUT_GET01', null, false);
                        }else if (result.length > 0){

                            data.email_responsable = data.email_responsable.toLowerCase();
        
                            const DateTime = new Date();
                            const date = `${DateTime.getFullYear()}-${(DateTime.getMonth()+1)}-${DateTime.getDate()}`
                            const time = `${DateTime.getHours()}:${DateTime.getMinutes()}:${DateTime.getSeconds()}`;

                            data.microservicio_interes = process.env.MICROSERVICIO_INTERES;
                            data.modulo_interes = process.env.MODULOS_INTERES;
                            data.nombre_microservicio = process.env.MICROSERVICIO_INTERES;
                            data.fecha_actualizacion = date;
                            data.hora_actualizacion = time;      

                            Request.put({
                                "headers": { 'Authorization': `Bearer ${token}` },
                                "url": `http://${process.env.HOST_AUTH}/api/dispositivos`,
                                "json": data
                            }, (error, response, body) => {
                    
                                if(error) {
                                    return callback(`The update of the sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} could not be done in the Core platform`, '01NS_03PUT_GET01', null, false);
                                }else if(response.body.success === true){

                                    const queryActulizarNodoSensor = `
                                        UPDATE NODO_SENSOR
                                            SET 
                                                MARCA = ?,
                                                REFERENCIA = ?,
                                                LATITUD = ?,
                                                LONGITUD = ?,
                                                EMAIL_RESPONSABLE = ?,
                                                DISPOSITIVO_ACTIVO = ?,
                                                FECHA_ACTUALIZACION = ?,
                                                HORA_ACTUALIZACION = ?
                                        WHERE ID_NODO_SENSOR = ?
                                    `;

                                    pool.query(
                                        queryActulizarNodoSensor,
                                        [data.marca, data.referencia, data.latitud, data.longitud, data.email_responsable, data.dispositivo_activo, date, time, data.id_nodo_sensor],
                                        (error, result) => {
                                            console.log(result);
                                            if(error){
                                                return callback(`The register with ID: ${data.id_nodo_sensor} could not be updated`, '01NS_03PUT_PUT02', null, false);
                                            }
                                            return callback(null, null, null, true);
                                        }
                                    )
                                }
                            })
                        }
                    }
                )
            }else{
                return callback(err, '01NS_03PUT_GET01', null, false);
            }
        })
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