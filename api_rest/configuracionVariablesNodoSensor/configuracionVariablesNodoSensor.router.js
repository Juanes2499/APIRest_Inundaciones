const {
    crearConfiguracioVariableNodoSensor,
    consultarConfiguracionesVariablesNodoSensorDinamico,
    eliminarConfiguracionVariablesNodoSensorByIDConfiguracion,
} = require('./configuracionVariablesNodoSensor.controller');

const {
    consultarVariablesNodoSensorDinamico
} = require('../variablesNodoSensor/variablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearConfiguracioVariableNodoSensor);
router.post("/get", consultarConfiguracionesVariablesNodoSensorDinamico);
router.post("/delete", eliminarConfiguracionVariablesNodoSensorByIDConfiguracion)

//Adicionales
router.post('/variablesNodoSensor/get', consultarVariablesNodoSensorDinamico);

module.exports = router;