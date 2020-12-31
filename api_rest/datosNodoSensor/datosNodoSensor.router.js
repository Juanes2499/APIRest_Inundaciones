const {
    crearDatoNodoSensor,
} = require('./datosNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearDatoNodoSensor);

module.exports = router;