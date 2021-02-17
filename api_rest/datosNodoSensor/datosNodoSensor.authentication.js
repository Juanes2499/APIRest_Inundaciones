const datosNodoSensorRouter = require('./datosNodoSensor.router');

const express = require('express');
const datosNodoSensorAuth = express();

const auth = require('../../shared/authentication');

datosNodoSensorAuth.use("/", datosNodoSensorRouter);

module.exports = datosNodoSensorAuth;