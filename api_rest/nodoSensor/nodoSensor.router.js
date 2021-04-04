const {
    crearNodoSensor,
    consultarNodoSensorDinamico,
    actualizarNodoSensor,
    eliminarNodoSensor,
    testt
} = require('./nodoSensor.controller');

const router = require('express').Router();

router.post("/test", testt);
router.post("/", crearNodoSensor);
router.post("/get",consultarNodoSensorDinamico);
router.put("/", actualizarNodoSensor);
router.post("/delete", eliminarNodoSensor);

module.exports = router;
