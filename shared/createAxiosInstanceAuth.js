var Request = require("request");

module.exports = {
    post: (headers, urlRelative, json, callback) => {
        Request.post({
            "headers": headers,
            "url": `http://${process.env.HOST_AUTH}${urlRelative}`,
            "json": json
        }, (error, response, body) => {
            
            if(error) {
                return callback(error, null, false);
            }else{
                return callback(null, response.body, true);
            }
        });
    }
};