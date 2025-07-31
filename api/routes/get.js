const express = require('express');
const router = express.Router();
const { getLecturas } = require("../controllers/index");

router.get('/lecturas', getLecturas);

module.exports = router;