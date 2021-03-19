const { Router } = require('express');
const {
    crearVariablesNodoSensor,
    consultarVariablesNodoSensorDinamico,
    actualizarVariableByID,
    eliminarVariableByIDByNombreVariable,
} = require('./variablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearVariablesNodoSensor);
router.post("/get", consultarVariablesNodoSensorDinamico);
router.put("/", actualizarVariableByID);
router.post("/delete", eliminarVariableByIDByNombreVariable)

module.exports = router;