const {
    crearReglaNodoSensor,
    consultarReglasNodoSensorDinamico,
    actualizarReglaNodoSensorById,
    eliminarReglaNodoSensorById,
} = require ('./reglasNodoSensor.controller');

const router = require('express').Router();

router.post("/", crearReglaNodoSensor);
router.get("/", consultarReglasNodoSensorDinamico);
router.put("/", actualizarReglaNodoSensorById);
router.delete("/",eliminarReglaNodoSensorById);

module.exports = router;