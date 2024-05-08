// Node Modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Custom Requires
const { sequelize } = require('../models');

const config = require('./config/vars');
const logger = require('./config/logger');
const routes = require('./routes');
const response = require('./utility/response');
const rescodes = require('./utility/rescodes');

// app express
const app = express();

// Enable Logger & Performance
app.use(
	logger.httpErrorLogger,
	logger.httpSuccessLogger,
	logger.performanceLogger,
);

// cors Options
const corsOptions = {
	origin: '*',
};
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: `${config.bodyParser.limit}` }));
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: `${config.bodyParser.limit}`,
	}),
);

app.use(express.static('public'));
app.use('/images', express.static('images'));

// API V1 Action Routs
app.use('/api/v1', routes);

// home handler
app.use('/', (err, req, res, next) => {
	res.response = { code: 404, message: rescodes.notFound };
	next();
});

// 404 handler
routes.use((err, req, res, next) => {
	res.response = { code: 404, data: { message: rescodes.notFound } };
	next();
}, response.default);

// create schema
const createSchema = async function () {
	await sequelize.showAllSchemas({ logging: false }).then(async (data) => {
		if (!data.includes(config.db.schema)) {
			await sequelize.createSchema(config.db.schema);
		}
	});
};
createSchema();

// connect database
sequelize
	.sync({ logging: false })
	.then(() => {
		logger.info('DB Connection Successful');
		app.listen(config.app.port, () => {
			logger.info(`Listening to port ${config.app.port}`);
		});
	})
	.catch((error) => {
		logger.info('DB Connection Error');
		logger.info(error.message);
	});

module.exports = app;
