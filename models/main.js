const { Model } = require('sequelize');
const config = require('../src/config/vars');

module.exports = (sequelize, DataTypes) => {
	class main extends Model {}
	main.init(
		{
			mainArticleName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			mainImage: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			noOfCrops: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			deletedAt: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
		},
		{
			sequelize,
			modelName: 'main',
			schema: config.db.schema,
			freezeTableName: true,
			paranoid: true,
		},
	);

	main.associate = function (models) {
		main.hasMany(models.individual, { foreignKey: 'id' });
	};
	return main;
};
