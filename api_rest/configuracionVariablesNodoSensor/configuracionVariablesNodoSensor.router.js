const {
    crearConfiguracioVariableNodoSensor,
    consultarConfiguracionesVariablesNodoSensor,
    consultarConfiguracionVariablesNodoSensorByNombreVariable,
    consultarConfiguracionVariablesNodoSensorByIDConfiguracionByIDNodoSensorByIDVariable,
    eliminarConfiguracionVariablesNodoSensorByIDConfiguracion,
} = require('./configuracionVariablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearConfiguracioVariableNodoSensor);
router.get("/", consultarConfiguracionesVariablesNodoSensor);
router.get("/nombreVariable", consultarConfiguracionVariablesNodoSensorByNombreVariable);
router.get("/ids", consultarConfiguracionVariablesNodoSensorByIDConfiguracionByIDNodoSensorByIDVariable);
router.delete("/", eliminarConfiguracionVariablesNodoSensorByIDConfiguracion)

module.exports = router;