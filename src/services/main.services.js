const { main, individual } = require('../../models/index');

module.exports = {
	createMain: async (imagePath, mainArticleName, noOfCrops) => {
		const createdMain = await main.create({
			mainImage: imagePath,
			mainArticleName: mainArticleName,
			noOfCrops,
		});
		return createdMain;
	},

	getAll: async () => {
		const getAll = await main.findAll({ where: { isActive: true } });
		return getAll;
	},

	getById: async (id) => {
		const getById = await main.findByPk(id, { where: { isActive: true } });
		return getById;
	},

	update: async (id, file, mainArticleName, noOfCrops) => {
		const update = await main.update(
			{
				mainArticleName: mainArticleName,
				mainImage: file,
				noOfCrops: noOfCrops,
			},
			{ where: { id: id } },
		);
		return update;
	},

	deleteImageById: async (id) => {
		const deleteImageById = await main.destroy({ where: { id } });
		const deleteCroppedImages = await individual.destroy({
			where: { mainImageId: id },
		});
		return deleteImageById;
	},
};
