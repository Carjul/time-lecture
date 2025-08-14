// src/api/fetchData.js
import axios from 'axios';
import { initDB, saveLecturasBatch } from '../storage/storage';

const API_URL = 'https://time-lecture.onrender.com/api/all-lecturas';

export const descargarDatosProgresivamente = async () => {
  initDB()

  let page = 1;
  let limit = 5000; // Puedes ajustarlo para no llenar la memoria
  let totalPaginas = 1;

  while (page <= totalPaginas) {
    const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    const { data, total } = res.data;


    // Calcular páginas totales
    totalPaginas = Math.ceil(total / limit);

    // Guardar datos en SQLite progresivamente
    saveLecturasBatch(data);

    console.log(`Página ${page} guardada en SQLite`);
    page++;
  }

  console.log("✅ Descarga completa");

  return {  fromCache: true };
};

