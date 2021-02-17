const {
    crearConfiguracioVariableNodoSensor,
    consultarConfiguracionesVariablesNodoSensorDinamico,
    eliminarConfiguracionVariablesNodoSensorByIDConfiguracion,
} = require('./configuracionVariablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearConfiguracioVariableNodoSensor);
router.get("/", consultarConfiguracionesVariablesNodoSensorDinamico);
router.delete("/", eliminarConfiguracionVariablesNodoSensorByIDConfiguracion)

module.exports = router;