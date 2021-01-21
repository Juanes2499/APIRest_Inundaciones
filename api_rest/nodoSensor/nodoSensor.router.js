const {
    crearNodoSensor,
    consultarNodoSensorDinamico,
    actualizarNodoSensor,
    eliminarNodoSensor,
} = require('./nodoSensor.controller');

const router = require('express').Router();

router.post("/", crearNodoSensor);
router.get("/",consultarNodoSensorDinamico);
router.put("/", actualizarNodoSensor);
router.delete("/", eliminarNodoSensor);

module.exports = router;
