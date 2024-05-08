const { Op } = require('sequelize');
const { main, individual } = require('../../models/index');

module.exports = {
	create: async (
		imagePath,
		id,
		mainArticleName,
		articleName,
		axisX,
		axisY,
		width,
		height,
		tags,
		color,
		fabric,
	) => {
		const create = await individual.create({
			croppedImage: imagePath,
			mainImageId: id,
			mainArticleName,
			articleName,
			axisX,
			axisY,
			width,
			height,
			tags,
			color,
			fabric,
		});
		return create;
	},

	getAll: async (whereClause) => {
		const getAll = await individual.findAll({ where: whereClause });
		return getAll;
	},

	getById: async (id) => {
		const getById = await individual.findOne({
			where: { id: id, isActive: true },
		});
		return getById;
	},

	getAllCropped: async (mainImageId) => {
		const getAllCropped = await individual.findAll({
			where: { mainImageId: mainImageId, isActive: true },
			attributes: [
				'id',
				'croppedImage',
				'axisX',
				'axisY',
				'width',
				'height',
				'tags',
				'color',
				'fabric',
				'createdAt',
			],
		});
		return getAllCropped;
	},

	update: async (
		id,
		file,
		mainImageId,
		mainArticleName,
		articleName,
		axisX,
		axisY,
		width,
		height,
		tags,
		color,
		fabric,
	) => {
		const update = await individual.update(
			{
				croppedImage: file,
				mainImageId,
				mainArticleName,
				articleName,
				axisX,
				axisY,
				width,
				height,
				tags,
				color,
				fabric,
			},
			{ where: { id: id } },
		);
		return update;
	},

	deleteImageById: async (id) => {
		const deleteImageById = await individual.destroy({ where: { id } });
		return deleteImageById;
	},
};
