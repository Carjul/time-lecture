const express = require("express");
const morgan = require("morgan");
const { connectDB } = require("./db/index");
const dotenv = require('dotenv')
const cors = require("cors");
const path = require("path")
dotenv.config()

const app = express();

app.set('port', process.env.PORT)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static("public/dist"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Todas las rutas que NO sean /api/* devuelven index.html (para rutas internas del frontend)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "public/dist/"));
});

// Importa y usa las rutas
app.use("/api",require("./routes/get"));
app.use("/api",require("./routes/post"));


connectDB();

app.listen(app.get('port'), () => console.log("server express run on port "+app.get('port')));