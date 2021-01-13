const login = require('../users/login.router');
const userAuth = require('../users/user.authentication');
const rolesAuth = require('../Roles/roles.authentication');
const configuracionRolesAuth = require('../configuracionRoles/configuracionRoles.authentication');
const nodoSensorAuth = require('../nodoSensor/nodoSensor.authentication');
const variablesNodoSensorAuth = require('../variablesNodoSensor/variablesNodoSensor.authentication');
const configuracionVariablesNodoSensorAuth = require('../configuracionVariablesNodoSensor/configuracionVariblesNodoSensor.authentication');
const datosNodoSensorAuth = require('../datosNodoSensor/datosNodoSensor.authentication');

const express = require('express');
const generalRouters = express();

generalRouters.use("/login", login);
generalRouters.use("/users", userAuth);
generalRouters.use("/roles", rolesAuth);
generalRouters.use("/configuracionRol", configuracionRolesAuth);
generalRouters.use("/nodoSensor", nodoSensorAuth);
generalRouters.use("/variablesNodoSensor", variablesNodoSensorAuth);
generalRouters.use("/configuracionVariablesNodoSensor", configuracionVariablesNodoSensorAuth);
generalRouters.use("/datosNodoSensor", datosNodoSensorAuth);

module.exports = generalRouters;

