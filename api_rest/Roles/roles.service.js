const pool = require("../../config/database");

module.exports = {
    crear_rol: (data, callback) => {
        data.nombre_rol = data.nombre_rol.toUpperCase();
        pool.query(
            `SELECT * FROM ROLES
                WHERE NOMBRE_ROL = ? `,
            [data.nombre_rol],
            (error, result) => {
                if(result.length > 0){
                    return callback(`The role: ${data.nombre_rol} already exist`, null, false);
                }else if(result.length === 0){
                    pool.query(
                        `
                        INSERT
                            INTO ROLES
                            (NOMBRE_ROL, DETALLES, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (?, ?, CURDATE(), CURTIME()) `,
                        [data.nombre_rol, data.detalles],
                        (error, result) => {
                            if(error){
                                return callback(`The role: ${data.nombre_rol} already exist`, null, false);
                            }
                            return callback(null, result, true);
                        }
                    )
                }
            }
        )
    }
}