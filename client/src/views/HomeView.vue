<template>
  <div class="container">
    <header>
      <h1>Tiempos de Lectura</h1>
    </header>
    <main>
      <div class="tipo-busqueda">
        <strong>Buscar por:</strong>
        <div>
          <input type="radio" id="medidor" value="0" v-model="tipo" />
          <label for="medidor">Medidor</label>
        </div>
        <div>
          <input type="radio" id="nic" value="1" v-model="tipo" />
          <label for="nic">NIC</label>
        </div>
      </div>

      <section class="busqueda">
        <div>
          <select v-model="rango">
            <option v-for="n in rangos" :key="n" :value="n">{{ n }}</option>
          </select>
          <select v-if="rango === 'Itinerario'" v-model="itinerario">
            <option v-for="cn in cruces" :key="cn" :value="cn">{{ cn }}</option>
          </select>
        </div>
        <input type="text" v-model="num" placeholder="Ingrese número" />
        <button @click="fetchLecturas">Buscar</button>
      </section>
      <div v-if="alertMsg === 'no encontrado'">
        <AlertMsg :msg="alertMsg" @close="alertMsg = ''" />
      </div>
      <div v-else>
        <LecturasList :lecturas="lecturas" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LecturasList from '../components/LecturasList.vue'
import AlertMsg from '../components/AlertMsg.vue'

const lecturas = ref([])
const cruces = ref([])
const num = ref('')
const tipo = ref(0) // 0 para Medidor, 1 para NIC
const rango = ref(10)
const itinerario = ref('1-4')
const rangos = [10, 20, 30, 40, 50, 60, 'Itinerario']
const alertMsg = ref('')
const fetchLecturas = async () => {
  if (!num.value) return;

  try {
    // Construimos la URL dinámicamente
    const baseUrl = rango.value === 'Itinerario'
      ? '/api/lecturasByItin'
      : '/api/lecturas';
    
    const params = new URLSearchParams({
      num: num.value,
      tipo: tipo.value,
    });

    if (rango.value === 'Itinerario') {
      params.append('itin', itinerario.value);
    } else {
      params.append('rango', rango.value);
    }

    // Hacemos una sola llamada fetch
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    // Verificamos respuesta
    if (data.Msg) {
      lecturas.value = [];
      alertMsg.value = data.Msg;
      resetZoom();
      return;
    }

    // Si todo va bien
    alertMsg.value = '';
    lecturas.value = data;

    // Aplicar zoom solo si es móvil
    applyZoomIfMobile();

  } catch (error) {
    console.error('Error al obtener lecturas:', error);
    alertMsg.value = 'Error al conectarse al servidor';
    lecturas.value = [];
    resetZoom();
  }
};

// 🔹 Funciones auxiliares
function applyZoomIfMobile() {
  if (window.innerWidth <= 768) {
    document.body.style.transform = "scale(0.46)";
    document.body.style.transformOrigin = "0 0";
  }
}

function resetZoom() {
  document.body.style.transform = "scale(1)";
  document.body.style.transformOrigin = "center";
}

/* 
const fetchLecturas = async () => {
  if (!num.value) return
  if (rango.value === 'Itinerario') {
    const response = await fetch(`/api/lecturasByItin?num=${num.value}&itin=${itinerario.value}&tipo=${tipo.value}`)
    const data = await response.json()
    if (data.Msg) {
      lecturas.value = []
      alertMsg.value = data.Msg
      document.body.style.transform = "scale(1)";
      return
    }
    alertMsg.value = ''
    lecturas.value = data
  }else{
     const res = await fetch(`/api/lecturas?num=${num.value}&rango=${rango.value}&tipo=${tipo.value}`)
    const data = await res.json()
    if (data.Msg) {
      lecturas.value = []
      alertMsg.value = data.Msg
      document.body.style.transform = "scale(1)";
      return
    }
    alertMsg.value = ''
    lecturas.value = data 
  }
  if (window.innerWidth <= 768) {
    document.body.style.transform = "scale(0.46)";
    document.body.style.transformOrigin = "0 0";
  }
  
} */
const fectItin = async () => {
  const resp = await fetch(`/api/cruces`)
  const data = await resp.json()
  cruces.value = data.cruces
}
onMounted(fetchLecturas)
onMounted(fectItin)
</script>
<style scoped>
:root {
  --primary-bg: #e8f5e9;
  --secondary-bg: #c8e6c9;
  --accent: #388e3c;
  --accent-dark: #1b5e20;
  --accent-light: #a5d6a7;
  --text-main: #1b5e20;
  --text-secondary: #388e3c;
  --header-bg: #43a047;
  --header-text: #fff;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.tipo-busqueda {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.container {
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
  align-items: start;
  background: var(--primary-bg);
  box-sizing: border-box;
}

header {
  width: 100%;
  text-align: center;
  margin-bottom: 0.5rem;
  background: var(--header-bg);
  color: var(--header-text);
  padding: 0rem 0;
  border-radius: 10px;
  letter-spacing: 2px;
}

main {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  width: 100%;
  justify-items: center;
}

.busqueda {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
  align-items: center;
  justify-items: center;
  width: 90%;
  max-width: 450px;
  margin: 0 auto;
  background: var(--secondary-bg);
  padding: 1rem;
  border-radius: 8px;
}

.busqueda select,
.busqueda input {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid var(--accent-light);
  background: var(--primary-bg);
  color: var(--text-main);
  font-family: inherit;
  transition: border 0.2s;
  width: 100%;
}

.busqueda input {
  max-width: 180px;
}

.busqueda button {
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #0001;
}

.busqueda button:hover {
  background: var(--accent-dark);
}
</style>