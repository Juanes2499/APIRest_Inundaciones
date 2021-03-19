const {
    crearNodoSensor,
    consultarNodoSensorDinamico,
    actualizarNodoSensor,
    eliminarNodoSensor,
} = require('./nodoSensor.controller');

const router = require('express').Router();

router.post("/", crearNodoSensor);
router.post("/get",consultarNodoSensorDinamico);
router.put("/", actualizarNodoSensor);
router.post("/delete", eliminarNodoSensor);

module.exports = router;
