const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');
const logger = require('../config/logger');
const config = require('../config/vars');
const mainService = require('../services/main.services');
const individualService = require('../services/individual.services');
const rescodes = require('../utility/rescodes');

const individualModule = {};

individualModule.create = async (req, res, next) => {
	try {
		const { file } = req;
		const {
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
		} = req.body;
		const getImage = await mainService.getById(mainImageId);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.masterImageNF },
			};
			return next();
		}
		const tagsArray = tags
			.replace('[', '')
			.replace(']', '')
			.split(',')
			.map((tag) => tag.trim().toLowerCase());
		if (!file) {
			res.response = {
				code: 400,
				data: { status: 'Ok', message: rescodes?.imageRequired },
			};
			return next();
		}
		const imagePath = path.join(
			__dirname,
			'../../public',
			'images',
			`${file.originalname}`,
		);
		const imageName = path.basename(file.originalname);
		const imageUrl = `${config.app.backendURL}/images/${imageName}`;
		await individualService.create(
			imageUrl,
			mainImageId,
			mainArticleName,
			articleName,
			axisX,
			axisY,
			width,
			height,
			tagsArray,
			color,
			fabric,
		);
		res.response = {
			code: 201,
			data: { status: 'Ok', message: rescodes?.croppedImageCreated },
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

individualModule.getAll = async (req, res, next) => {
	try {
		const { searchTerm } = req.query;
		let whereClause = { isActive: true };
		if (searchTerm) {
			whereClause[Op.or] = [
				{ tags: { [Op.contains]: [searchTerm] } },
				{ color: { [Op.iLike]: `%${searchTerm}%` } },
				{ fabric: { [Op.iLike]: `%${searchTerm}%` } },
			];
		}
		const individualImages = await individualService.getAll(whereClause);
		const croppedDetails = individualImages.map((cropImage) => {
			return {
				id: cropImage.id,
				mainImageId: cropImage.mainImageId,
				croppedImage: cropImage.croppedImage,
				axisX: cropImage.axisX,
				axisY: cropImage.axisY,
				width: cropImage.width,
				height: cropImage.height,
				tags: cropImage.tags,
				color: cropImage.color,
				fabric: cropImage.fabric,
			};
		});
		res.response = {
			code: 200,
			data: { status: 'Ok', data: croppedDetails },
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

individualModule.getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const getImage = await individualService.getById(id);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.croppedImageNF },
			};
			return next();
		}
		const getMainImage = await mainService.getById(getImage.mainImageId);
		const {
			mainImageId,
			croppedImage,
			axisX,
			axisY,
			width,
			height,
			tags,
			color,
			fabric,
		} = getImage;
		const formattedResponse = {
			mainImageId,
			mainImage: getMainImage.mainImage,
			croppedImage,
			axisX,
			axisY,
			width,
			height,
			tags,
			color,
			fabric,
		};
		res.response = {
			code: 200,
			data: { status: 'Ok', data: formattedResponse },
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

individualModule.getAllDetails = async (req, res, next) => {
	try {
		const { id } = req.params;
		const getImage = await individualService.getById(id);
		const mainImageId = getImage.mainImageId;
		const allCroppedImages = await individualService.getAllCropped(mainImageId);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.croppedImageNF },
			};
			return next();
		}
		res.response = {
			code: 200,
			data: { status: 'Ok', data: allCroppedImages },
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

individualModule.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { file } = req;
		if (!file) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.croppedImageNF },
			};
			return next();
		}
		const {
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
		} = req.body;
		const getImage = await individualService.getById(id);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.croppedImageNF },
			};
			return next();
		}
		const tagsArray = tags
			.replace('[', '')
			.replace(']', '')
			.split(',')
			.map((tag) => tag.trim());
		const imagePath = path.join(
			__dirname,
			'..',
			'uploads',
			`${Date.now()}_${file.originalname}`,
		);
		await fs.writeFile(imagePath, file.buffer);
		await individualService.update(
			id,
			imagePath,
			mainImageId,
			mainArticleName,
			articleName,
			axisX,
			axisY,
			width,
			height,
			tagsArray,
			color,
			fabric,
		);
		res.response = {
			code: 200,
			data: { status: 'Ok', message: rescodes.croppedImageUpdated },
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

individualModule.deleteById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const getImage = await individualService.getById(id);
		if (!getImage) {
			res.response = {
				code: 404,
				data: { status: 'Error', message: rescodes.croppedImageNF },
			};
			return next();
		}
		const imageToDelete = getImage.croppedImage;
		await fs.unlink(imageToDelete);
		await individualService.deleteImageById(id);
		res.response = {
			code: 200,
			data: { status: 'Ok', message: rescodes.croppedImageDeleted },
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

module.exports = individualModule;
