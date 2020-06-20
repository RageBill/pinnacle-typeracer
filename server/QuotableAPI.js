/**
 * Getting random quotes from Quotable
 * ref: https://github.com/lukePeavey/quotable
 */
const axios = require("axios");

const uri = "http://api.quotable.io/random";

module.exports = getData = () => axios.get(uri).then((response) => response.data.content.split(" "));
