const Joi = require('joi');

const create = {
	body: Joi.object().keys({
		mainImageId: Joi.number().required(),
		axisX: Joi.number().required(),
		axisY: Joi.number().required(),
		width: Joi.number().required(),
		height: Joi.number().required(),
		tags: Joi.string().required(),
		color: Joi.string().required(),
		fabric: Joi.string().required(),
	}),
};

const getById = {
	params: Joi.object({
		id: Joi.number().required(),
	}),
};

const update = {
	params: Joi.object({
		id: Joi.number().required(),
	}),
	body: Joi.object().keys({
		mainImageId: Joi.number().required(),
		axisX: Joi.number().optional(),
		axisY: Joi.number().optional(),
		width: Joi.number().optional(),
		height: Joi.number().optional(),
		tags: Joi.string().optional(),
		color: Joi.string().optional(),
		fabric: Joi.string().optional(),
	}),
};

const deleteById = {
	params: Joi.object({
		id: Joi.number().required(),
	}),
};

module.exports = {
	create,
	getById,
	update,
	deleteById,
};
