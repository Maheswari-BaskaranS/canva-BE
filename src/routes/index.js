const express = require('express');

const routes = express.Router();

const response = require('../utility/response');

routes.use('/master', require('./main.routes'), response.default);
routes.use('/individual', require('./individual.routes'), response.default);

module.exports = routes;
