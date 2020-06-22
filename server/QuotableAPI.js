/**
 * Getting random quotes from Quotable
 * ref: https://github.com/lukePeavey/quotable
 */
const axios = require("axios");

const uri = "http://api.quotable.io/random";

const getData = () => axios.get(uri).then((response) => response.data.content.split(" "));

module.exports = getData;
