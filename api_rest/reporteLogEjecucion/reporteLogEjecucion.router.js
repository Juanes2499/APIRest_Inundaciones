const {
    consultarReporteLogEjecucionDinamico
} = require ('./reporteLogEjecucion.controller.js');

const router = require('express').Router();

router.get("/", consultarReporteLogEjecucionDinamico);

module.exports = router;