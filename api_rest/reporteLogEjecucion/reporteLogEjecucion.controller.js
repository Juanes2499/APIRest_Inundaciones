const {
    crear_reporteLogEjecucion,
} = require('./reporteLogEjecucion.service');

module.exports = {
    crearReporteLogEjecucion: (req) => {
        
        const body = req;

        crear_reporteLogEjecucion(body, (err, errorCode, result, state) => {
            if(state === false){
                return {
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearReporteLogEjecucion"
                }
            }
            return true;
        })
    }
}