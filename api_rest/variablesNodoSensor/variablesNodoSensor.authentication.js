const variablesNodoSensorRouter = require('./variablesNodoSensor.router');

const express = require('express');
const variablesNodoSensorAuth = express();

const auth = require('../../shared/authentication');

variablesNodoSensorAuth.use("/", variablesNodoSensorRouter);

module.exports = variablesNodoSensorAuth;