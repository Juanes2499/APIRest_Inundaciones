const {
    crear_Usuario, 
    consultar_Usuarios, 
    autenticar_ByEmail, 
    /*update_user, 
    delete_user, 
    get_user_by_email*/
} = require('./user.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config()

module.exports = {
    crearUsuario: (req,res)=>{

        const body = req.body;
        const salt = genSaltSync(10);
        
        const encriptPass = new Promise((resolve, reject)=>{
            body.password = hashSync(body.password,salt)
            resolve()
        })

        encriptPass
            .then()
            .catch((err)=>{
                console.log(err);
            });
        
        crear_Usuario(body, (err, result, state)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearUsuario",
                    return: err
                })
            }
            return res.status(201).json({
                success: state,
                statusCode:201
              });
        });
    },

    consultarUsuarios: (req, res) => {
        consultar_Usuarios((err, result, state) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarUsuarios"
                })
            }

            result.forEach(element => {
                element.PASSWORD = undefined;
            });

            return res.status(200).json({
                success: state,
                statusCode:200,
                data: result
            });
        });
    },

    /*getUserById: (req, res)=>{
        const id = req.params.id;
        get_user_by_user_id(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Register was not found"
                });
            }
            console.log(results)
            results.password = undefined;
            return res.json({
                success: 1,
                data: results
            });
        });
    },

    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        
        const encriptPass = new Promise((resolve, reject)=>{
            body.password = hashSync(body.password,salt)
            resolve()
        })
        encriptPass
            .then()
            .catch((err)=>{
                console.log(err);
            });

        update_user(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "Register was updated successfully"
            });
        });
    },

    deleteUser: (req, res) => {
        const data = req.body;
        delete_user(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
            return res.json({
                success: 0,
                message: "Register was not found"
            });
            }
            return res.json({
                success: 1,
                message: "User was deleted successfully"
            });
        });
    },*/

    login: (req, res) => {
        const body = req.body;
        autenticar_ByEmail(body, (err, results, state) => {
            if (err) {
                console.log(err);
            }

            if (!results) {
                return res.status(500).json({
                success: state,
                statusCode: 500,
                message: "Invalid email"
                });
            }

            console.log(results);

            const result = compareSync(body.password, results.PASSWORD);
            

            if (result) {

                results.PASSWORD = undefined;
                
                const payloald = results;

                const key = process.env.TOKEN_KEY.toString();
                const expiresIn = parseInt(process.env.TOKEN_EXPIRE_IN);

                const jsontoken = sign(payloald, key, {
                    expiresIn: expiresIn,
                });

                return res.json({
                    success: state,
                    statusCode:200,
                    message: "login successfully",
                    nombre: results.NOMBRES,
                    apellido: results.APELLIDOS,
                    token: jsontoken,
                    tiempo: `${expiresIn/60} minutos`
                });
            } else {
                return res.status(500).json({
                    success: state,
                    statusCode: 500,
                    message: "Invalid email or password",
                });
            }
        });
      },
}