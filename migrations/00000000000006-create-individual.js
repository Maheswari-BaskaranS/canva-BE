const { DataTypes } = require('sequelize');
const config = require('../src/config/vars');
/** @type {import('sequelize-cli').Migration} */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'individual',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				mainImageId: {
					type: Sequelize.INTEGER,
					references: {
						model: 'main',
						key: 'id',
					},
					onDelete: 'CASCADE',
					allowNull: false,
				},
				mainArticleName: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				articleName: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				croppedImage: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				axisX: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				axisY: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				width: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				height: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				tags: {
					type: Sequelize.ARRAY(DataTypes.STRING),
					allowNull: false,
				},
				color: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				fabric: {
					type: Sequelize.STRING,
					allowNull: false,
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
		await queryInterface.dropTable('individual');
	},
};
