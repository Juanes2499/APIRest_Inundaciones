const {
    crearNodoSensor,
    consultarNodoSensor,
    consultarNodoSensorByID,
    actualizarNodoSensor,
    eliminarNodoSensor,
} = require('./nodoSensor.controller');

const router = require('express').Router();

router.post("/", crearNodoSensor);
router.get("/", consultarNodoSensor);
router.get("/id",consultarNodoSensorByID);
router.put("/", actualizarNodoSensor);
router.delete("/", eliminarNodoSensor);

module.exports = router;
