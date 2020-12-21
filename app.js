require("dotenv").config()
const express = require('express');
const app = express();

const userRouter = require('./api_rest/users/user.router');
const nodoSensorRouter = require('./api_rest/nodoSensor/nodoSensor.router');

app.get("/api",(req, res) =>{
    res.json({
        success: 1,
        message: "This API Rest is working"
    });
});

app.use(express.json());

//Router
app.use("/api/users", userRouter);
app.use("/api/nodoSensor", nodoSensorRouter);
//app.use("/api/agendarCitas", agendarCitaRouter);
//app.use("/api/medicamentos", medicamentos);

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

