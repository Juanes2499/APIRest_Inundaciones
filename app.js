require("dotenv").config()
const express = require('express');
const app = express();
//const auth = require('./shared/authentication');

const userRouter = require('./api_rest/users/user.router');
const roles = require('./api_rest/Roles/roles.router');
const configuracionRoles = require('./api_rest/configuracionRoles/configuracionRoles.router');
const nodoSensorRouter = require('./api_rest/nodoSensor/nodoSensor.router');

app.get("/api",(req, res) =>{
    res.json({
        success: true,
        message: "This API Rest is working"
    });
});

app.use(express.json());

//Router
app.use("/api/users", userRouter);
app.use("/api/roles", roles);
app.use("/api/configuracionRol", configuracionRoles);
app.use("/api/nodoSensor", nodoSensorRouter);

//Desplegar server
const ServerDeploy = new Promise((resolve,reject)=>{
    app.listen(process.env.PORT_SERVER, ()=>{
        resolve();
    });
})

ServerDeploy
    .then(()=>{
        console.log(`The server was deployed on ${process.env.PORT_SERVER} port`);
    })
    .catch((err)=>{
        console.log(err);
    })

