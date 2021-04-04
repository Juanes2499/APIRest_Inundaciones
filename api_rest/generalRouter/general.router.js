const express = require('express');
const generalRouters = express();

let auth = process.env.AUTHENTICATION.toString();

if(auth === "true"){

    console.log(`Authentication = ${auth}`)

    const nodoSensorAuth = require('../nodoSensor/nodoSensor.authentication');
    const variablesNodoSensorAuth = require('../variablesNodoSensor/variablesNodoSensor.authentication');
    const configuracionVariablesNodoSensorAuth = require('../configuracionVariablesNodoSensor/configuracionVariblesNodoSensor.authentication');
    const reglasNodoSensorAuth = require('../reglasNodoSensor/reglasNodoSensor.authentication');
    const datosNodoSensorAuth = require('../datosNodoSensor/datosNodoSensor.authentication');

    const erroresLogEjecucionAuth = require('../erroresLogEjecucion/erroresLogEjecucion.authentication');
    const ReporteErroresLogEjecucionAuth = require('../reporteLogEjecucion/reporteLogEjecucion.authentication');
   
    //generalRouters.use("/nodoSensor", nodoSensorAuth);
    generalRouters.use("/variablesNodoSensor", variablesNodoSensorAuth);
    generalRouters.use("/configuracionVariablesNodoSensor", configuracionVariablesNodoSensorAuth);
    generalRouters.use("/reglasNodoSensor", reglasNodoSensorAuth);
    generalRouters.use("/datosNodoSensor", datosNodoSensorAuth);

    generalRouters.use("/erroresLogEjecucion", erroresLogEjecucionAuth);
    generalRouters.use("/reporteErroresLogEjecucion", ReporteErroresLogEjecucionAuth);

}else if (auth === "false"){

    console.log(`Authentication = ${auth}`)
    
    const nodoSensorRouter = require('../nodoSensor/nodoSensor.router');
    const variablesNodoSensorRouter = require('../variablesNodoSensor/variablesNodoSensor.router');
    const configuracionVariablesNodoSensorRouter = require('../configuracionVariablesNodoSensor/configuracionVariablesNodoSensor.router');
    const reglasNodoSensorRouter = require('../reglasNodoSensor/reglasNodoSensor.router');
    const datosNodoSensorRouter = require('../datosNodoSensor/datosNodoSensor.router');

    const erroresLogEjecucionRouter = require('../erroresLogEjecucion/erroresLogEjecucion.router');
    const ReporteErroresLogEjecucionRouter = require('../reporteLogEjecucion/reporteLogEjecucion.router');

    //generalRouters.use("/nodoSensor", nodoSensorRouter);
    generalRouters.use("/variablesNodoSensor", variablesNodoSensorRouter);
    generalRouters.use("/configuracionVariablesNodoSensor", configuracionVariablesNodoSensorRouter);
    generalRouters.use("/reglasNodoSensor", reglasNodoSensorRouter);
    generalRouters.use("/datosNodoSensor", datosNodoSensorRouter);

    generalRouters.use("/erroresLogEjecucion", erroresLogEjecucionRouter);
    generalRouters.use("/reporteErroresLogEjecucion", ReporteErroresLogEjecucionRouter);
}

module.exports = generalRouters;

