const {
    crearRol,
} = require('./roles.controller');

const router = require('express').Router();

router.post("/", crearRol);

module.exports = router;