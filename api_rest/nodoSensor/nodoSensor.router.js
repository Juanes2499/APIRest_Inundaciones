const {
    crearNodoSensor,
    consultarNodoSensorDinamico,
    actualizarNodoSensor,
    eliminarNodoSensor,
    actualizarTokenNodoSensor
} = require('./nodoSensor.controller');

const router = require('express').Router();

router.post("/", crearNodoSensor);
router.post("/get",consultarNodoSensorDinamico);
router.put("/", actualizarNodoSensor);
router.post("/delete", eliminarNodoSensor);
router.put("/actualizarTokenNodoSensor", actualizarTokenNodoSensor);

module.exports = router;
