const pool = require("../../config/database");
const compararJson = require("../../shared/compararJson");
const consultaDinamica = require("../../shared/consultaDinamica");

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
                if(result.length === 0){
                    return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} was not found`, null, false);
                }else if(result.length > 0){
                    
                    const nodoSensorToJson = JSON.parse(JSON.stringify(result))[0];
                    
                    if(data.token != nodoSensorToJson.TOKEN){
                        return callback(`The token of the sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} is not the same`, null, false);
                    }

                    if(nodoSensorToJson.ESTADO != true){
                        return callback(`The sensor node with ID_NODO_SENSOR: ${data.id_nodo_sensor} is disabled`, null, false);
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
                            CVNS.FECHA_CREACION FECHA_CREACION_CONFIGURACION,
                            CVNS.HORA_CREACION HORA_CREACION_CONFIGURACION
                        FROM NODO_SENSOR NS
                        INNER JOIN 
                            CONFIGURACION_VARIABLES_NODO_SENSOR CVNS 
                            ON NS.ID_NODO_SENSOR = CVNS.ID_NODO_SENSOR 
                            where NS.ID_NODO_SENSOR = ?
                    `;

                    pool.query(
                        queryConsultarVariablesNodoSensor,
                        [data.id_nodo_sensor],
                        (error, result) => {

                            const variablesNodoSensorToJson = JSON.parse(JSON.stringify(result));

                            const variablesNodoSensor = new Object();

                            variablesNodoSensorToJson.forEach(x => {
                                variablesNodoSensor[x.NOMBRE_VARIABLE.toLowerCase().replace(" ", "_")] = true;
                            });

                            const variablesErrorArray = compararJson(variablesNodoSensor, data.variables);

                            if(variablesErrorArray.length > 0){
                                const msgVariablesError = `The variable(s): ${variablesErrorArray.toString().replace(",", ", ")} is/are not allowed to POST for the sensor nodo with ID_NODO_SENSOR: ${data.id_nodo_sensor}`;
                                return callback(msgVariablesError, null, false);
                            }

                            const VariablesInsertar = Object.keys(data.variables);

                            for(var i = 0; i < VariablesInsertar.length; i++){

                                const idNodoSensor = data.id_nodo_sensor;
                                const nombreVariable = VariablesInsertar[i].toLocaleUpperCase().replace("_"," ");
                                const valorDato = Object.values(data.variables)[i];

                                const queryInsertarDatosNodoSensor = `
                                    INSERT 
                                        INTO DATOS_NODO_SENSOR
                                        (ID_NODO_SENSOR, ID_VARIABLE, VALOR_DATO, FECHA_CREACION, HORA_CREACION)
                                    VALUES 
                                        (
                                            ?,
                                            (SELECT ID_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE NOMBRE_VARIABLE = ?),
                                            ?,
                                            CURDATE(),
                                            CURTIME()
                                        )
                                `;

                                pool.query(
                                    queryInsertarDatosNodoSensor,
                                    [idNodoSensor, nombreVariable, valorDato],
                                    (error, result) => {
                                        if(error){
                                            return callback(`The data: {${nombreVariable}: ${valorDato}} could not be created for the sensor node with ID_NODO_SENSOR: ${idNodoSensor}`, null, false);
                                        }
                                    }
                                )
                            }

                            return callback(null, result, true);
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
                (SELECT NOMBRE_VARIABLE FROM VARIABLES_NODO_SENSOR WHERE ID_VARIABLE =  DNS.ID_VARIABLE)NOMBRE_VARIABLE,
                DNS.VALOR_DATO,
                DNS.FECHA_CREACION,
                DNS.HORA_CREACION 
            FROM DATOS_NODO_SENSOR DNS
            ORDER BY DNS.FECHA_CREACION DESC, HORA_CREACION DESC
        `;
        
        const queryConsultarDatosNodoSensorDinamico = consultaDinamica(
            queryBaseConsultarDatosNodoSensorDinamico, 
            data.seleccionar, 
            data.condicion,
            data.agrupar,
            data.ordernar);

        pool.query(
            queryConsultarDatosNodoSensorDinamico,
            [],
            (error, result, fields) => {
                if(error){
                    return callback(`There is no any register with the parameters set`, null, false);
                }else if (result.length > 0){
                    return callback(null, result, true);
                }
            }
        )
    }
}