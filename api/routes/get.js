const express = require('express');
const router = express.Router();
const { getLecturas, getAllLecturas, getLecturasItinereario, getCruces } = require("../controllers/index");

router.get('/lecturas', getLecturas);

router.get('/lecturasByItin',getLecturasItinereario );

router.get("/cruces", getCruces)

router.get('/ping', (req, res)=>{
    res.json({ok: "api server run"})
})
router.get('/all-lecturas', getAllLecturas);

module.exports = router;