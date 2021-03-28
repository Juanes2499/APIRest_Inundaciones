const {
    crearReglaNodoSensor,
    consultarReglasNodoSensorDinamico,
    actualizarReglaNodoSensorById,
    eliminarReglaNodoSensorById,
} = require ('./reglasNodoSensor.controller');

const {
    consultarVariablesNodoSensorDinamico
} = require('../variablesNodoSensor/variablesNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearReglaNodoSensor);
router.post("/get", consultarReglasNodoSensorDinamico);
router.put("/", actualizarReglaNodoSensorById);
router.post("/delete",eliminarReglaNodoSensorById);

//Adicionales
router.post('/variablesNodoSensor/get', consultarVariablesNodoSensorDinamico);

module.exports = router;