const {createPool} = require("mysql");

const ConnectionDB = new Promise ((resolve,reject)=>{
    const conexion = createPool({
        host: process.env.MYSQL_HOST,
        port:process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DATABASE,
    });
    module.exports = conexion;
    resolve(conexion)
})

ConnectionDB
    .then((conexion)=>{
        console.log(`Successful connection`);
    }).catch((err)=>{
        console.log(err);
    })