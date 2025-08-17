// src/api/fetchData.js
import axios from 'axios';
import { initDB, saveLecturasBatch ,insertCarga } from '../storage/storage';

const API_URL = 'https://time-lecture.onrender.com/api/all-lecturas';

export const descargarDatosProgresivamente = async (onProgress) => {
  initDB();

  const limit = 5000;        // ajusta según tu memoria
  let total = 0;
  let totalPaginas = 1;
  let saved = 0;

  // 1) Primer request para saber total
  let page = 1;
  const first = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  const { data: data1, total: totalCount } = first.data;

  total = totalCount || (data1?.length ?? 0);
  totalPaginas = Math.max(1, Math.ceil(total / limit));

  // Guardar y reportar progreso
  if (Array.isArray(data1) && data1.length) {
    saveLecturasBatch(data1);
    saved += data1.length;
  }
  onProgress?.({ page, totalPaginas, saved, total });

  // 2) Resto de páginas
  for (page = 2; page <= totalPaginas; page++) {
    const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    const { data } = res.data;

    if (Array.isArray(data) && data.length) {
      saveLecturasBatch(data);
      saved += data.length;
    }

    onProgress?.({ page, totalPaginas, saved, total });
  }

  console.log("✅ Descarga completa");
  return { fromCache: true, saved, total };
};
