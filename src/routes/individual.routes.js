const express = require('express');
const multer = require('multer');
const {
	getById,
	getAll,
	getAllDetails,
	create,
	update,
	deleteById,
} = require('../controllers/individual.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.post('/create', upload.single('file'), create);
router.get('/getAll', getAll);
router.get('/getById/:id', getById);
router.get('/getAllDetails/:id', getAllDetails);
router.put('/update/:id', upload.single('file'), update);
router.delete('/delete/:id', deleteById);

module.exports = router;
