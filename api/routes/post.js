const express = require('express');
const router = express.Router();
const upload = require("../config/multer");
const { uploadFile } = require("../controllers/index");

router.post('/upload', upload, uploadFile);

module.exports = router;