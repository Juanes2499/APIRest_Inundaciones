const axios = require('axios');

const createAxiosInstanceAuth = (token, config) => {
    let API_AUTH = process.env.HOST_AUTH;
    let minConfig = {
        baseURL: API_AUTH,
        headers: { 'Authorization': `Bearer ${token}`}
    }
    if (config) {
        minConfig = { ...minConfig, ...config }
    }
    return axios.create(minConfig)
}

module.exports = createAxiosInstanceAuth;