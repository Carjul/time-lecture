import * as SQLite from 'expo-sqlite';

// Abrir o crear BD
const db = SQLite.openDatabaseSync('mydb.db');

export const initDB = () => {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS lecturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    NIC INTEGER,
    Medidor INTEGER,
    Suscriptor TEXT,
    Localidad TEXT,
    Direccion TEXT,
    Fecha REAL,
    CRUCE TEXT,
    ORDEN INTEGER,
    UNIQUE (NIC, Medidor) ON CONFLICT IGNORE
);

CREATE TABLE IF NOT EXISTS Cargue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status INTEGER DEFAULT 0
  );

`,
  )
  
};

export const insertCarga = (num) => {
  db.execSync(
    `INSERT INTO Cargue (status)  
    VALUES (?)`, [num]
  )
};

export const getCarga = () => {
  try {
    const rows = db.getAllSync(`SELECT * FROM lecturas;`);
    return rows; // this is an array of objects
  } catch (err) {
    console.error('Error :', err);
    return [];
  }
};
export const insertLectura = (lectura, success, error) => {
  db.execSync(
    `INSERT INTO lecturas (NIC, Medidor, Suscriptor, Localidad, Direccion, Fecha, CRUCE, ORDEN)  
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [lectura.NIC, lectura.Medidor, lectura.Suscriptor, lectura.Localidad, lectura.Dirección, lectura.Fecha, lectura.CRUCE, lectura.ORDEN],
    (_, result) => success && success(result),
    (_, err) => error && error(err)
  )
};

export const getLecturas = () => {
  try {
    const rows = db.getAllSync(`SELECT * FROM lecturas;`);
    return rows; // this is an array of objects
  } catch (err) {
    console.error('Error leyendo lecturas:', err);
    return [];
  }
};






// Guardar un lote de lecturas
export const saveLecturasBatch = (lecturas) => {
  if (!Array.isArray(lecturas) || lecturas.length === 0) return;

  db.withTransactionSync(() => {
    const stmt = db.prepareSync(`
      INSERT INTO lecturas
        (NIC, Medidor, Suscriptor, Localidad, Direccion, Fecha, CRUCE, ORDEN)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const l of lecturas) {
      stmt.executeSync([
        l.NIC,
        l.Medidor,
        l.Suscriptor,
        l.Localidad,
        l.Dirección,
        l.Fecha,
        l.CRUCE,
        l.ORDEN
      ]);
    }

    stmt.finalizeSync();
  });

  console.log(`✅ Guardadas ${lecturas.length} lecturas`);
};



export const buscarLecturasConRango = (num, rango) => {
  if (!num && !rango) {
    return { error: "Medidor o Nic son requeridos" };
  }

  const nicNum = parseInt(num);
  const r = parseInt(rango);

  // Buscar registro central por NIC o Medidor
  let registroCentral = db.getFirstSync(
    `SELECT * FROM lecturas WHERE NIC = ? LIMIT 1;`,
    [nicNum]
  );

  if (!registroCentral) {
    registroCentral = db.getFirstSync(
      `SELECT * FROM lecturas WHERE Medidor = ? LIMIT 1;`,
      [nicNum]
    );
  }

  if (!registroCentral) {
    return { Msg: "no encontrado" };
  }

  // Obtener anteriores (ORDEN menor que el central)
  const anteriores = db.getAllSync(
    `SELECT * FROM lecturas WHERE ORDEN < ? ORDER BY ORDEN DESC LIMIT ?;`,
    [registroCentral.ORDEN, r]
  ).reverse(); // Invertir para que queden en orden ascendente

  // Obtener siguientes (ORDEN mayor que el central)
  const siguientes = db.getAllSync(
    `SELECT * FROM lecturas WHERE ORDEN > ? ORDER BY ORDEN ASC LIMIT ?;`,
    [registroCentral.ORDEN, r]
  );

  return {
    anteriores,
    central: registroCentral,
    siguientes
  };
};


export const borrarTodo = () => {
  try {
    db.execSync(`DELETE FROM lecturas;`);
    insertCarga(0)
    return "Todos los registros han sido eliminados";
  } catch (error) {
    console.error("Error al borrar los datos:", error);
  }
};