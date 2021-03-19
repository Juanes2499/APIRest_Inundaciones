const {
    crearConfiguracioVariableNodoSensor,
    consultarConfiguracionesVariablesNodoSensorDinamico,
    eliminarConfiguracionVariablesNodoSensorByIDConfiguracion,
} = require('./configuracionVariablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearConfiguracioVariableNodoSensor);
router.post("/get", consultarConfiguracionesVariablesNodoSensorDinamico);
router.post("/delete", eliminarConfiguracionVariablesNodoSensorByIDConfiguracion)

module.exports = router;