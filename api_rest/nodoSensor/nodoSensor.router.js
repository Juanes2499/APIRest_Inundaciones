const {
    crearNodoSensor,
    consultarNodoSensor,
    consultarNodoSensorByID,
    actualizarNodoSensor,
    eliminarNodoSensor,
} = require('./nodoSensor.controller');

const auth = require('./../../shared/authentication');

const router = require('express').Router();

router.post("/", auth, crearNodoSensor);
router.get("/", consultarNodoSensor);
router.get("/id", consultarNodoSensorByID);
router.put("/", auth, actualizarNodoSensor);
router.delete("/", auth, eliminarNodoSensor);

module.exports = router;
