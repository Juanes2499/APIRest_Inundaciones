const configuracionVariablesNodoSensor = require('./configuracionVariablesNodoSensor.router');

const express = require('express');
const configuracionVariablesNodoSensorAuth = express();

const auth = require('../../shared/authentication');

configuracionVariablesNodoSensorAuth.use("/", configuracionVariablesNodoSensor);

module.exports = configuracionVariablesNodoSensorAuth;