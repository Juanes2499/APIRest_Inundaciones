const { Router } = require('express');
const {
    crearVariablesNodoSensor,
    consultarVariablesNodoSensor,
    consultarVariableByNombreVariable,
    actualizarVariableByIDByNombreVariable,
    eliminarVariableByIDByNombreVariable,
} = require('./variablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearVariablesNodoSensor);
router.get("/", consultarVariablesNodoSensor);
router.get("/nombreVariable", consultarVariableByNombreVariable);
router.put("/", actualizarVariableByIDByNombreVariable);
router.delete("/", eliminarVariableByIDByNombreVariable)

module.exports = router;