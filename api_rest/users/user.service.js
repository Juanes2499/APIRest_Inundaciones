const pool = require("../../config/database");

module.exports={
    create_user: (data, callback)=>{
        pool.query(
            `INSERT INTO registration_user (nombre, apellido, genero, email, password, numero) VALUES (?,?,?,?,?,?)`,
            [
                data.nombre,
                data.apellido,
                data.genero,
                data.email,
                data.password,
                data.numero,
            ],
            (error, results, fields) =>{
                if(error){
                    return callback(error)
                }
                return callback(null, results)
            }
        );
    },
    get_user_by_email: (email, callBack) => {
        pool.query(
          `SELECT * FROM registration_user WHERE email = ?`,
          [email],
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
      },
    get_users: callback =>{
        pool.query(
            `SELECT * FROM registration_user`,
            [],
            (error, results, fields) =>{
                if(error){
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    get_user_by_user_id: (id, callback) => {
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
    }
}