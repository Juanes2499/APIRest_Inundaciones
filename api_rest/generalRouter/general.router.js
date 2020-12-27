const userRouter = require('../users/user.router');
const rolesRouter = require('../Roles/roles.router');
const configuracionRolesRouter = require('../configuracionRoles/configuracionRoles.router');
const nodoSensorAuth = require('../nodoSensor/nodoSensor.authentication');

const express = require('express');
const generalRouters = express();


generalRouters.use("/users", userRouter);
generalRouters.use("/roles", rolesRouter);
generalRouters.use("/configuracionRol", configuracionRolesRouter);
generalRouters.use("/nodoSensor", nodoSensorAuth);

module.exports = generalRouters;
