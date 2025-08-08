const XLSX = require("xlsx");
const fs = require("fs-extra");
const { collection } = require("../db/index");


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
    const { num, rango } = req.query;
    if (!num && !rango) {
        return res.status(400).json({ message: "Medidor o Nic son requeridos" });
    }
    const nicNum = parseInt(num);
    const r = parseInt(rango);

    let registroCentral = await collection.findOne({ NIC: nicNum });
    if (!registroCentral) {
        registroCentral = await collection.findOne({ Medidor: nicNum });
    }
    if (!registroCentral) {
        return res.json({ Msg: "no encontrado" });
    }
    const anteriores = await collection.find({ ORDEN: { $lt: registroCentral.ORDEN } })
        .sort({ ORDEN: -1 })
        .limit(r)
        .toArray();
    const siguientes = await collection.find({ ORDEN: { $gt: registroCentral.ORDEN } })
        .sort({ ORDEN: 1 })
        .limit(r)
        .toArray();
    res.json({
        anteriores: anteriores.reverse(),
        central: registroCentral,
        siguientes: siguientes,
    });
};

exports.getAllLecturas = async (req, res) => {
    const all = await collection.find().limit(1000).toArray();

    res.json(all);
}
