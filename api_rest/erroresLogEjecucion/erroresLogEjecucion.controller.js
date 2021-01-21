const {
    crear_erroresLogEjecucion,
} = require('./erroresLogEjecucion.service');
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");


module.exports = {
    crearErroresLogEjecucion: (req, res) => {

        const body = req.body;

        const parametros_crear_erroresLogEjecucion = {
            codigo_error: true,
            url_endpoint: true,
            modulo: true,
            endpoint: true,   
            metodo: true,
            detalles: true, 
            mensaje_pantalla: true
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametros_crear_erroresLogEjecucion, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            return res.status(500).json({
                success: false,
                statusCode: 500,
                errorInternalCode: 111,
                message: `${verificarParametro.messageFaltantes} or ${verificarParametro.messageMalEscritos}, please set a all required parameters`
            })
        }

        crear_erroresLogEjecucion(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    errorInternalCode: 111,
                    message: "Database create error - error in crearErroresLogEjecucion",
                    return: err
                })
            }

            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The error type: ${body.codigo_error} was successfully created`
            })
        })

    }
}
