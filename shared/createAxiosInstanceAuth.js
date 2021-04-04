const axios = require('axios');

const createAxiosInstanceAuth = (token, config) => {
    let minConfig = {
        baseURL: API_SENSORES_HOST,
        headers: { 'Authorization': `Bearer ${token}`}
    }
    if (config) {
        minConfig = { ...minConfig, ...config }
    }
    return axios.create(minConfig)
}

module.exports = createAxiosInstanceAuth;