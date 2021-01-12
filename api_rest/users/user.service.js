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
            `
                SELECT 
                    U.ID_USER,
                    U.NOMBRES,
                    U.APELLIDOS,
                    U.TIPO_DOC_ID,
                    U.NUMERO_DOC_ID,
                    U.EMAIL,
                    U.PASSWORD,
                    U.FECHA_CREACION, 
                    U.HORA_CREACION
                FROM USER U 
                WHERE 
                    U.EMAIL = ?
            `,
            [data.email],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The user with email: ${data.email} does not exist `, null, false);
                }else if(result.length > 0){

                    const resultToJson = JSON.parse(JSON.stringify(result));

                    const LoginJson = resultToJson[0];

                    const queryRoles =  `
                        SELECT 
                            CR.ID_CONFIGURACION,
                            U.ID_USER, 
                            U.EMAIL,
                            CR.ID_ROL, 
                            (SELECT 
                                NOMBRE_ROL 
                            FROM ROLES R 
                            WHERE ID_ROL = CR.ID_ROL) NOMBRE_ROL, 
                            U.FECHA_CREACION, 
                            U.HORA_CREACION
                        FROM USER U 
                        INNER JOIN 
                            CONFIGURACION_ROLES CR 
                            ON U.ID_USER = CR.ID_USER
                        WHERE 
                            U.EMAIL = ?        
                    
                    `;

                    pool.query(
                        queryRoles
                        ,
                        [data.email],
                        (error, result) => {
                            if(result.length === 0) {
                                return callback(`The user with email: ${data.email} does not have any role asigned`, null, false);
                            }else if(result.length > 0){
                                
                                const resultRolesToJson = JSON.parse(JSON.stringify(result));

                                resultRolesToJson.forEach(x => {
                                    LoginJson[`ROL_${x.NOMBRE_ROL}`] = true
                                });

                                return callback(null, LoginJson, true);
                            }
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