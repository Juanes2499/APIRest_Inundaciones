const {create_user, get_users, get_user_by_user_id, update_user, delete_user, get_user_by_email} = require('./user.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req,res)=>{
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
        
        create_user(body, (err, result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message: "Database connection error"
                })
            }
            return res.status(200).json({
                success: 1,
                data: result
              });
        });
    },

    getUsers: (req, res) => {
        get_users((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            
            results.forEach(element => {
                element.password = undefined;
            });

            return res.json({
                success: 1,
                data: results
            });
        });
    },

    getUserById: (req, res)=>{
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
    },

    login: (req, res) => {
        const body = req.body;
        get_user_by_email(body.email, (err, results) => {
          if (err) {
            console.log(err);
          }
          if (!results) {
            return res.json({
              success: 0,
              data: "Invalid email"
            });
          }
          const result = compareSync(body.password, results.password);
          if (result) {
            results.email = undefined;
            results.password = undefined;
            results.numero = undefined;
            results.id = undefined;
            const jsontoken = sign({ result: results }, "qwe1234", {
              expiresIn: "1h"
            });
            return res.json({
              success: 1,
              message: "login successfully",
              nombre: results.nombre,
              apellido: results.apellido,
              token: jsontoken,
              tiempo: "1h"
            });
          } else {
            return res.json({
              success: 0,
              data: "Invalid email or password",
            });
          }
        });
      },
}