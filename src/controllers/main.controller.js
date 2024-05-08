const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');
const config = require('../config/vars');
const mainService = require('../services/main.services');
const individualService = require('../services/individual.services');
const rescodes = require('../utility/rescodes');

const mainModule = {};

mainModule.create = async (req, res, next) => {
	try {
		const { file } = req;
		const { mainArticleName, noOfCrops } = req.body;
		if (!file) {
			res.response = {
				code: 400,
				data: { status: 'Ok', message: rescodes?.imageRequired },
			};
			return next();
		}
		const imageName = file.originalname.replace(/\s+/g, '').toLowerCase();
		const imagePath = path.join(__dirname, '../../public', 'images', imageName);
		await fs.writeFile(imagePath, file.buffer);
		const imageUrl = `${config.app.backendURL}/images/${imageName}`;
		const mainImageDetails = await mainService.createMain(
			imageUrl,
			mainArticleName,
			noOfCrops,
		);
		res.response = {
			code: 201,
			data: {
				status: 'Ok',
				data: { mainImageId: mainImageDetails.id },
				message: rescodes?.masterImageCreated,
			},
		};
	} catch (err) {
		logger.error(err);
		res.response = {
			code: 500,
			data: { status: 'Error', message: rescodes?.wentWrong },
		};
	}
	next();
};

mainModule.getAll = async (req, res, next) => {
	try {
		const mainImages = await mainService.getAll();
		const getImage = mainImages.map((getImage) => ({
			mainImageId: getImage.id,
			mainImageName: getImage.mainArticleName,
			mainImage: getImage.mainImage
				.replace('D:\\POC\\public', `${config.app.backendURL}`)
				.replace(/\\/g, '/'),
			noOfCrops: getImage.noOfCrops,
			createdAt: new Date(getImage.createdAt).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			}),
		}));
		res.response = {
			code: 200,
			data: { status: 'Ok', data: getImage },
		};
		return next();
	} catch (err) {
		logger.error(err);
		res.response = {
			code: 500,
			data: { status: 'Error', message: rescodes?.wentWrong },
		};
		return next();
	}
};

mainModule.getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const [mainImage, individualImages] = await Promise.all([
			mainService.getById(id),
			individualService.getAllCropped(id),
		]);
		if (!mainImage || !individualImages) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes?.masterImageNF },
			};
			return next();
		}
		const formattedIndividuals = individualImages.map(
			({
				id,
				croppedImage,
				axisX,
				axisY,
				width,
				height,
				tags,
				color,
				fabric,
				createdAt,
			}) => ({
				id,
				croppedImage,
				axisX,
				axisY,
				width,
				height,
				tags,
				color,
				fabric,
				createdAt: new Date(mainImage.createdAt).toLocaleDateString('en-GB', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				}),
			}),
		);
		const formattedResponse = {
			mainImageId: mainImage.id,
			mainImageName: mainImage.mainImageName,
			mainImage: mainImage.mainImage,
			noOfCrops: mainImage.noOfCrops,
			createdAt: new Date(mainImage.createdAt).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			}),
			individualImages: formattedIndividuals,
		};

		res.response = {
			code: 200,
			data: { status: 'Ok', data: formattedResponse },
		};
	} catch (err) {
		logger.error(err);
		res.response = {
			code: 500,
			data: { status: 'Error', message: rescodes?.wentWrong },
		};
	}
	next();
};

mainModule.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { file } = req;
		const { mainArticleName, noOfCrops } = req.body;
		const getImage = await mainService.getById(id);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.masterImageNF },
			};
			return next();
		}
		const imageName = file.originalname.replace(/\s+/g, '').toLowerCase();
		const imagePath = path.join(__dirname, '../../public', 'images', imageName);
		await fs.writeFile(imagePath, file.buffer);
		const imageUrl = `${config.app.backendURL}/images/${imageName}`;
		await mainService.update(id, imageUrl, mainArticleName, noOfCrops);
		res.response = {
			code: 200,
			data: { status: 'Ok', message: rescodes.masterImageUpdated },
		};
		return next();
	} catch (err) {
		logger.error(err);
		res.response = {
			code: 500,
			data: { status: 'Error', message: rescodes?.wentWrong },
		};
		return next();
	}
};

mainModule.deleteById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const getImage = await mainService.getById(id);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.masterImageNF },
			};
			return next();
		}
		await mainService.deleteImageById(id);
		res.response = {
			code: 200,
			data: { status: 'Ok', message: rescodes.masterImageDeleted },
		};
		return next();
	} catch (err) {
		logger.error(err);
		res.response = {
			code: 500,
			data: { status: 'Error', message: rescodes?.wentWrong },
		};
		return next();
	}
};

module.exports = mainModule;
