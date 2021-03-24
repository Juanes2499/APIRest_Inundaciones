const {
    crearReglaNodoSensor,
    consultarReglasNodoSensorDinamico,
    actualizarReglaNodoSensorById,
    eliminarReglaNodoSensorById,
} = require ('./reglasNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearReglaNodoSensor);
router.post("/get", consultarReglasNodoSensorDinamico);
router.put("/", actualizarReglaNodoSensorById);
router.post("/delete",eliminarReglaNodoSensorById);

module.exports = router;