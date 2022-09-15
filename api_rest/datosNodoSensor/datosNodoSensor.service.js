const pool = require("../../config/database");
const compararJson = require("../../shared/compararJson");
const consultaDinamica = require("../../shared/consultaDinamica");
const CreatorUUID = require('uuid');
const { Kafka } = require('kafkajs')

//Configuración Kafka
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [`${process.env.KAFKA_BROKER}`]
})

const producer = kafka.producer()

module.exports = {
    crear_datoNodoSensor: (data, callback) => {

        const queryCosultarExistenciaNodoSensor = `
            SELECT * FROM NODO_SENSOR
                WHERE ID_NODO_SENSOR = ?
        `;

        pool.query(
            queryCosultarExistenciaNodoSensor,
            [data.id_nodo_sensor],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(result.length === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, '05DNS_01POST_GET01', null, false);
                }else if(result.length > 0){
                    
                    const nodoSensorToJson = JSON.parse(JSON.stringify(result))[0];
                    
                    if(data.token != nodoSensorToJson.TOKEN){
                        return callback(`The token of the sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} is not the same`, '05DNS_01POST_GET02', null, false);
                    }

                    if(nodoSensorToJson.DISPOSITIVO_ACTIVO != true){
                        return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} is disabled`, '05DNS_01POST_GET03', null, false);
                    }

                    const queryConsultarVariablesNodoSensor = `
                        SELECT
                            CVNS.ID_CONFIGURACION,
                            NS.ID_NODO_SENSOR,
                            CVNS.ID_VARIABLE,
                            (SELECT 
                                VNS.NOMBRE_VARIABLE 
                            FROM VARIABLES_NODO_SENSOR VNS  
                            WHERE ID_VARIABLE = CVNS.ID_VARIABLE) NOMBRE_VARIABLE,
                            (SELECT 
                                VNS.UNIDAD_MEDIDA 
                            FROM VARIABLES_NODO_SENSOR VNS  
                            WHERE ID_VARIABLE = CVNS.ID_VARIABLE) UNIDAD_VARIABLE,
                            CVNS.FECHA_CREACION FECHA_CREACION_CONFIGURACION,
                            CVNS.HORA_CREACION HORA_CREACION_CONFIGURACION
                        FROM NODO_SENSOR NS
                        INNER JOIN 
                            CONFIGURACION_VARIABLES_NODO_SENSOR CVNS 
                            ON NS.ID_NODO_SENSOR = CVNS.ID_NODO_SENSOR 
                        WHERE NS.ID_NODO_SENSOR = ?
                    `;

                    pool.query(
                        queryConsultarVariablesNodoSensor,
                        [data.id_nodo_sensor],
                        (error, resultQueryConsultarVariablesNodoSensor) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                            }

                            const variablesNodoSensorToJson = JSON.parse(JSON.stringify(resultQueryConsultarVariablesNodoSensor));

                            const variablesNodoSensor = new Object();

                            variablesNodoSensorToJson.forEach(x => {
                                variablesNodoSensor[x.NOMBRE_VARIABLE.toLowerCase()] = true;
                            });

                            const variablesErrorArray = compararJson(variablesNodoSensor, data.variables);

                            if(variablesErrorArray.length > 0){
                                const msgVariablesError = `The variable(s): ${variablesErrorArray.toString().replace(",", ", ")} is/are not allowed to POST for the sensor nodo with ID_NODO_SENSOR: ${data.id_nodo_sensor}`;
                                return callback(msgVariablesError, '05DNS_01POST_GET04', null, false);
                            }

                            const VariablesInsertar = Object.keys(data.variables);

                            for(var i = 0; i < VariablesInsertar.length; i++){

                                const idNodoSensor = data.id_nodo_sensor;
                                const nombreVariable = VariablesInsertar[i].toUpperCase();
                                const valorDato = Object.values(data.variables)[i];

                                if (valorDato === null){
                                    return callback(`The data: {${nombreVariable}: ${valorDato}} could not be created because is null for the sensore node: ${idNodoSensor}`, '05DNS_01POST_POST06', null, false);
                                }

                                const uuid = CreatorUUID.v4();

                                const validacionReglas = (callback) => {

                                    //Se hace el envio de la notificacion
                                    const queryConsultarRegla = `
                                        SELECT * FROM REGLAS_NODO_SENSOR 
                                        WHERE ID_NODO_SENSOR = ? AND NOMBRE_VARIABLE = ?
                                    `;

                                    pool.query(
                                        queryConsultarRegla,
                                        [idNodoSensor, nombreVariable],
                                        (error, resultQueryConsultarRegla) => {

                                            if (error){
                                                return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                                            }

                                            const datosNotificados = {
                                                valorNotificado: false,
                                                idRegla: null,
                                                expesionEvaluada: null
                                            }

                                            if(resultQueryConsultarRegla.length > 0){
                                                
                                                const reglaFromJson = JSON.parse(JSON.stringify(resultQueryConsultarRegla))[0];
                                                
                                                const regex = new RegExp(reglaFromJson.EXPRESION)

                                                if(regex.test(valorDato)){

                                                    const messagePublish = {
                                                        topic: process.env.KAFKA_TOPIC,
                                                        id_registro_dato: uuid,
                                                        id_nodo_sensor: idNodoSensor,
                                                        nombre_variable: nombreVariable,
                                                        unidad_variable: variablesNodoSensorToJson.find(x => x.NOMBRE_VARIABLE === nombreVariable).UNIDAD_VARIABLE,
                                                        valor_dato: valorDato
                                                    }

                                                    const objMessagePublish= JSON.stringify(messagePublish); // payload is a buffer

                                                    console.log(objMessagePublish);
                                                    
                                                    //Envio a Kafka
                                                    var sendMessage = async () => {
                                                        await producer.connect()
                                                            .then(x => {
                                                                console.log(`Kafka Connected`);
                                                            })
                                                        await producer.send({
                                                          topic: `${process.env.KAFKA_TOPIC}`,
                                                          messages: [
                                                            { key: `${process.env.KAFKA_kEY}`, value: objMessagePublish },
                                                          ],
                                                        })
                                                        await producer.disconnect()
                                                    }
                                                    
                                                    sendMessage();
                                                    
                                                    datosNotificados.valorNotificado = true;
                                                    datosNotificados.idRegla = reglaFromJson.ID_REGLA;
                                                    datosNotificados.expesionEvaluada = reglaFromJson.EXPRESION;
                                                }
                                            }

                                            return callback(datosNotificados);
                                        }
                                    )
                                }                             

                                validacionReglas(parametersRules => {

                                    const res = new Object(parametersRules);
                                    
                                    //Se inserta el dato despues de haber validado la regla y la regex
                                    const queryInsertarDatosNodoSensor = `
                                        INSERT 
                                            INTO DATOS_NODO_SENSOR
                                            (ID_DATO, ID_NODO_SENSOR, ID_VARIABLE, NOMBRE_VARIABLE, VALOR_DATO, VALOR_NOTIFICADO, ID_REGLA, EXPRESION_EVALUADA, FECHA_CREACION, HORA_CREACION)
                                        VALUES 
                                            (
                                                ?,
                                                ?,
                                                (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?),
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
                                        queryInsertarDatosNodoSensor,
                                        [uuid, idNodoSensor, nombreVariable, nombreVariable, valorDato, res.valorNotificado, res.idRegla, res.expesionEvaluada],
                                        (error, resultQueryInsertarDatosNodoSensor) => {
                                            if(error){
                                                return callback(`The data: {${nombreVariable}: ${valorDato}} could not be created for the sensor node with ID_NODO_SENSOR: ${idNodoSensor}`, '05DNS_01POST_POST05', null, false);
                                            }
                                        }
                                    )
                                })
                            }

                            return callback(null, null, resultQueryConsultarVariablesNodoSensor, true);
                        }
                    )
                }
            }
        )
    },
    consutar_datosNodoSensor_dinamico: (data, callback) => {

        let queryBaseConsultarDatosNodoSensorDinamico = `
            SELECT
                DNS.ID_DATO,
                DNS.ID_NODO_SENSOR,
                (SELECT LATITUD FROM NODO_SENSOR WHERE ID_NODO_SENSOR = DNS.ID_NODO_SENSOR) LATITUD,
                (SELECT LONGITUD FROM NODO_SENSOR WHERE ID_NODO_SENSOR = DNS.ID_NODO_SENSOR) LONGITUD,
                DNS.ID_VARIABLE,
                DNS.NOMBRE_VARIABLE,
                DNS.VALOR_DATO,
                DNS.VALOR_NOTIFICADO,
                DNS.ID_REGLA,
                DNS.EXPRESION_EVALUADA,
                DNS.FECHA_CREACION,
                DNS.HORA_CREACION
            FROM DATOS_NODO_SENSOR DNS
            ORDER BY DNS.FECHA_CREACION DESC, DNS.HORA_CREACION DESC
        `;
        
        const queryConsultarDatosNodoSensorDinamico = consultaDinamica(
            queryBaseConsultarDatosNodoSensorDinamico, 
            data.seleccionar, 
            data.condicion,
            data.agrupar,
            data.ordenar);

        if(queryConsultarDatosNodoSensorDinamico.query == null && queryConsultarDatosNodoSensorDinamico.error === true){
            return callback(queryConsultarDatosNodoSensorDinamico.message, '05DNS_02GET_GETPARAMETER01', null, false);
        }

        pool.query(
            queryConsultarDatosNodoSensorDinamico.query,
            [],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for data sensor node with the parameter(s) set`, '05DNS_02GET_GET02', null, false);
                }else if (result.length > 0){
                    return callback(null, null, result, true);
                }
            }
        )
    }
}