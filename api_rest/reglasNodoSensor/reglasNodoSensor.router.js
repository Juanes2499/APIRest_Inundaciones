const {
    crearReglaNodoSensor,
} = require ('./reglasNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearReglaNodoSensor);

module.exports = router;