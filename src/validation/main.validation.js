const Joi = require('joi');

const getById = {
	params: Joi.object({
		id: Joi.number().required(),
	}),
};

const deleteById = {
	params: Joi.object({
		id: Joi.number().required(),
	}),
};

module.exports = {
	getById,
	deleteById,
};
