const { Model } = require('sequelize');
const config = require('../src/config/vars');

module.exports = (sequelize, DataTypes) => {
	class individual extends Model {}
	individual.init(
		{
			mainImageId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			mainArticleName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			articleName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			croppedImage: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			axisX: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			axisY: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			width: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			height: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			tags: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				allowNull: false,
			},
			color: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			fabric: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			deletedAt: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
		},
		{
			sequelize,
			modelName: 'individual',
			schema: config.db.schema,
			freezeTableName: true,
			paranoid: true,
		},
	);

	individual.associate = function (models) {
		individual.belongsTo(models.main, { foreignKey: 'mainImageId' });
	};

	return individual;
};
