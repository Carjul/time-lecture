const express = require('express');
const router = express.Router();
const { getLecturas } = require("../controllers/index");

router.get('/lecturas', getLecturas);

router.get('/ping', (req, res)=>{
    res.json({ok: "api server run"})
})

module.exports = router;