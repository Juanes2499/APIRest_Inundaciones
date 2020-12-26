const pool = require("../../config/database");

module.exports={
    crear_Usuario: (data, callback)=>{
        data.email = data.email.toLowerCase();
        pool.query(
            `
            SELECT * FROM USER
                WHERE (TIPO_DOC_ID = ? AND NUMERO_DOC_ID = ?) OR EMAIL = ? `,
            [data.tipo_doc_id, data.numero_doc_id, data.email],
            (error, result) => {
                if(result.length > 0){
                    return callback(`The register with email: ${data.email} was created`, null, false);
                } else if (result.length === 0){
                    pool.query(
                        `
                        INSERT 
                            INTO USER 
                            (NOMBRES, APELLIDOS, TIPO_DOC_ID, NUMERO_DOC_ID, EMAIL, PASSWORD, FECHA_CREACION, HORA_CREACION)
                        VALUES 
                            (?,?,?,?,?,?, CURDATE(), CURTIME())`,
                        [
                            data.nombres,
                            data.apellidos,
                            data.tipo_doc_id,
                            data.numero_doc_id,
                            data.email,
                            data.password
                        ],
                        (error, result) =>{
                            if(error){
                                return callback(`The register with email: ${data.email} was created`, null, false)
                            }
                            return callback(null, result, true)
                        }
                    );
                }
            }
        )
    },
    consultar_Usuarios: callback =>{
        pool.query(
            `SELECT * FROM USER`,
            [],
            (error, result, fields) =>{
                if(error){
                    return callback(error, null, false);
                }
                return callback(null, result, true);
            }
        );
    },
    autenticar_ByEmail: (data, callback) => {
        pool.query(
            `SELECT * FROM PARAMETROS_CONFIGURACION_API
                WHERE NOMBRE_PARAMETRO = 'Permisos_usuario_login' `,
            [],
            (error, result) => {
                if(result.length === 0){
                    return callback(`El parámetro de configuracion de API: Permisos_usuario_login no existe `, null, false);
                }else if(result.length > 0){

                    const parametroToJson = JSON.parse(JSON.stringify(result));
                    const valorParametro = parametroToJson[0].VALOR_PARAMETRO;

                    const queryLogin =  `
                            SELECT 
                                U.ID_USER,
                                U.NOMBRES,
                                U.APELLIDOS,
                                U.TIPO_DOC_ID,
                                U.NUMERO_DOC_ID,
                                U.EMAIL,
                                U.PASSWORD,
                                ${valorParametro} 
                                U.FECHA_CREACION, 
                                U.HORA_CREACION
                            FROM USER U 
                            WHERE 
                                U.EMAIL = ?
                            GROUP BY U.EMAIL `;

                    pool.query(
                        queryLogin
                        ,
                        [data.email],
                        (error, result) => {
                            if (error) {
                                console.log(result);
                                return callback(error, null, false);
                            }
                            return callback(null, result, true);
                        }
                    );
                }
            }
        )

    },
    /*get_user_by_user_id: (id, callback) => {
        pool.query(
            `SELECT * FROM registration_user WHERE id = ?`,
            [id],
            (error, results, fields)=>{
                if(error){
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
    update_user: (data, callBack) => {
        pool.query(
          `UPDATE registration_user SET nombre=?, apellido=?, genero=?, email=?, password=?, numero=? WHERE id = ?`,
          [
            data.nombre,
            data.apellido,
            data.genero,
            data.email,
            data.password,
            data.numero,
            data.id
          ],
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
    },
    delete_user: (data, callBack) => {
        pool.query(
            `DELETE FROM registration_user WHERE id = ?`,
            [data.id],
            (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results[0]);
            }
        );
    }*/
}