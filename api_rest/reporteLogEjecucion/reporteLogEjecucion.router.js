const {
    consultarReporteLogEjecucionDinamico
} = require ('./reporteLogEjecucion.controller.js');

const router = require('express').Router();

router.post("/get", consultarReporteLogEjecucionDinamico);

module.exports = router;