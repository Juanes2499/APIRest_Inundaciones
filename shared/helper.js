var Request = require("request");

module.exports = {
    validarExistenciaDispositivoAutenticacion: (data, token, callback) => {
        Request.post({
            "headers": { 'Authorization': `Bearer ${token}` },
            "url": `http://${process.env.HOST_AUTH}/api/dispositivos/get`,
            "json": data
        }, (error, response, body) => {

            if(error) {
                return callback('There is an error trying to request the device created', false);
            }else if(response){
                return callback(null, true);
            }
        })
    }
}