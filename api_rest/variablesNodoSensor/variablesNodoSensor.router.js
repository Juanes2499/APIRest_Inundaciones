const {
    crearVariablesNodoSensor,
    consultarVariablesNodoSensor,
    consultarVariableByNombreVariable,
} = require('./variablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearVariablesNodoSensor);
router.get("/", consultarVariablesNodoSensor);
router.get("/nombreVariable", consultarVariableByNombreVariable);

module.exports = router;