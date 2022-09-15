require("dotenv").config()
var cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const app = express();

const generalRouter = require('./api_rest/generalRouter/general.router');

//Cors
app.use(cors())

//Test API
app.get("/api",(req, res) =>{
    res.json({
        success: true,
        message: "This API Rest is working"
    });
});


// Middleware
app.use(morgan('combined')); //It is used when it is in a development environment to be able to print a log in the console
app.use(express.urlencoded({extended: false})) //Allows the server to understand forms sent from HTML
app.use(express.json()); //Allows the server to receive JSON formats and understand them

//Router
app.use("/api", generalRouter);


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

