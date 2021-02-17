const { Router } = require('express');
const {
    crearVariablesNodoSensor,
    consultarVariablesNodoSensorDinamico,
    actualizarVariableByID,
    eliminarVariableByIDByNombreVariable,
} = require('./variablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearVariablesNodoSensor);
router.get("/", consultarVariablesNodoSensorDinamico);
router.put("/", actualizarVariableByID);
router.delete("/", eliminarVariableByIDByNombreVariable)

module.exports = router;