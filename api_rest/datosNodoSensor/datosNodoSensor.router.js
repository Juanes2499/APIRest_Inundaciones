const {
    crearDatoNodoSensor,
    consutarDatosNodoSensorDinamico,
} = require('./datosNodoSensor.controller');

const router = require('express').Router();

router.post("/get", consutarDatosNodoSensorDinamico);

module.exports = router;