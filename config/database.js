const { createPool, createConnection } = require("mysql");

const db_config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
}

var connection = createPool(db_config);

// let connection;

// function handleDisconnect() {
//     // the old one cannot be reused.
//     connection = createConnection(db_config); // Recreate the connection, since
    
//     connection.connect(function (err) {              // The server is either down
//         if (err) {                                     // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//         }                                     // to avoid a hot loop, and to allow our node script to
//         else{
//             console.log('Database connected successfully');
//         }
//     });                                     // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     connection.on('error', function (err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                      // connnection idle timeout (the wait_timeout
//             throw err;                                  // server variable configures this)
//         }
//     });

//     return connection;
// }

// handleDisconnect();

module.exports = connection;





