const { Router } = require('express');
const {
    crearErroresLogEjecucion,
    consultarErroresLogEjecucion,
    actualizarErrorLogEjecucionById,
    eliminarErrorLogEejecucionById
} = require('./erroresLogEjecucion.controller');

const router = require('express').Router();

//router.post("/", crearErroresLogEjecucion);
router.post("/get", consultarErroresLogEjecucion);
//router.put("/", actualizarErrorLogEjecucionById);
//router.delete("/", eliminarErrorLogEejecucionById);

module.exports = router;