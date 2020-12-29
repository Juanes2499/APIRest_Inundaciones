const {
    crearConfiguracioVariableNodoSensor,
} = require('./configuracionVariablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearConfiguracioVariableNodoSensor);

module.exports = router;