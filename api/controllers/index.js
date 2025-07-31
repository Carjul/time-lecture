const XLSX = require("xlsx");
const fs = require("fs-extra");
const { collection } = require("../db/index");

function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial);
    const total_seconds = Math.round(86400 * fractional_day);
    date_info.setSeconds(total_seconds);
    return date_info.toISOString().replace('T', ' ').substring(0, 19);
}

exports.uploadFile = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }
    const excel = XLSX.readFile(req.file.path);
    const hoja = excel.Sheets['Lecturas'];
    var lecturas = XLSX.utils.sheet_to_json(hoja);
    if (lecturas.length === 0) {
        return res.status(500).json({ message: "nombre de la hoja incorrecto" });
    }
    for (let i = 0; i < lecturas.length; i++) {
        let pos = i + 1;
        const elemet = lecturas[i];
        elemet.ORDEN = pos;
        await collection.insertOne(elemet);
    }
    await fs.unlink(req.file.path);
    res.send("Archivo subido exitosamente.");
};

exports.getLecturas = async (req, res) => {
    const { num } = req.query;
    if (!num) {
        return res.status(400).json({ message: "Medidor o Nic son requeridos" });
    }
    const nicNum = parseInt(num);
    let registroCentral = await collection.findOne({ NIC: nicNum });
    if (!registroCentral) {
        registroCentral = await collection.findOne({ Medidor: nicNum });
    }
    if (!registroCentral) {
        return res.json({ Msg: "no encontrado" });
    }
    const anteriores = await collection.find({ ORDEN: { $lt: registroCentral.ORDEN } })
        .sort({ ORDEN: -1 })
        .limit(12)
        .toArray();
    const siguientes = await collection.find({ ORDEN: { $gt: registroCentral.ORDEN } })
        .sort({ ORDEN: 1 })
        .limit(12)
        .toArray();
    res.json({
        anteriores: anteriores.reverse(),
        central: registroCentral,
        siguientes: siguientes,
    });
};