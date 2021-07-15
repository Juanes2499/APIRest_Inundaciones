const {createPool, createConnection} = require("mysql");

const db_config = {
    host: process.env.MYSQL_HOST,
    port:process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
}
var connection = createPool(db_config); 

//var connection = createConnection(db_config); 

// function handleDisconnect() {
//     var connectiontest = createConnection(db_config); 
//     connectiontest.connect(function(err) {              
//         if(err) {                                     
//             console.log('Error connecting Database: ', err);
//             setTimeout(handleDisconnect, 2000);
//             module.exports = connectiontest; 
//         }else{
//             console.log('Database connected successfully');         
//         }
//     });               
// }

// handleDisconnect()

//connection.on(())
module.exports = connection; 

    



