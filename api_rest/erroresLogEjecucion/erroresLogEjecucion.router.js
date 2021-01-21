const { Router } = require('express');
const {
    crearErroresLogEjecucion
} = require('./erroresLogEjecucion.controller');

const router = require('express').Router();

router.post("/", crearErroresLogEjecucion);

module.exports = router;