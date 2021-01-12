const {
    crearDatoNodoSensor,
    consutarDatosNodoSensorDinamico,
} = require('./datosNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearDatoNodoSensor);
router.get("/", consutarDatosNodoSensorDinamico);

module.exports = router;