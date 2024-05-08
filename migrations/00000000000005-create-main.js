const config = require('../src/config/vars');
/** @type {import('sequelize-cli').Migration} */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'main',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				mainArticleName: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				mainImage: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				noOfCrops: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					defaultValue: true,
					allowNull: false,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: new Date(),
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: new Date(),
				},
				deletedAt: {
					allowNull: true,
					type: Sequelize.DATE,
					defaultValue: null,
				},
			},
			{
				schema: config.db.schema,
				freezeTableName: true,
			},
		);
	},
	async down(queryInterface) {
		await queryInterface.dropTable('main');
	},
};
