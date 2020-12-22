const {
    crear_rol,
} = require('./roles.service');

module.exports = {
    crearRol: (req, res) => {
        const body = req.body;
        crear_rol(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - error in crearRol",
                    return: err
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The role: ${body.nombre_rol} was successfully created`
            })
        })
    }
}