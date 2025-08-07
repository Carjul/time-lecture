<template>
  <section class="lecturas-section">
    
    <div v-if="!allLecturas.length">No hay lecturas para mostrar.</div>
    <table v-else>
      <thead>
        <tr>
          <th v-for="key in headers" :key="key">
          <th v-if="key === 'Fecha'">Hora</th>
          <th v-else>{{ key }}</th>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lectura, idx) in allLecturas" :key="lectura._id || idx"
          :class="{ central: idx === anterioresLength }">
          <td v-for="key in headers" :key="key">
            <span v-if="key === 'Fecha'">{{ formatFecha(lectura.Fecha) }}</span>
            <span v-else>{{ lectura[key] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lecturas: {
    type: Object,
    default: () => ({ anteriores: [], central: null, siguientes: [] })
  }
})

// Unifica todas las lecturas en un solo array
const allLecturas = computed(() => [
  ...(props.lecturas.anteriores || []),
  props.lecturas.central,
  ...(props.lecturas.siguientes || [])
].filter(Boolean))

// Calcula la posición de la central
const anterioresLength = computed(() => (props.lecturas.anteriores || []).length)
const headers = computed(() => {
  const first = allLecturas.value[0]
  return first
    ? Object.keys(first).filter(
      (key) => key !== '_id' && key !== 'CRUCE' && key !== 'ORDEN'
    )
    : []
})



// Convierte fecha Excel a legible
function formatFecha(serial) {
  if (!serial) return ''
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  const fractional_day = serial - Math.floor(serial)
  const total_seconds = Math.round(86400 * fractional_day)
  date_info.setSeconds(total_seconds)
  const parts = date_info.toLocaleString().split(',')
  return parts.length > 1 ? parts[1].trim() : date_info.toLocaleString()
}
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
  --table-header-bg: #388e3c;
  --table-header-text: #fff;
  --table-row-hover: #e8f5e9;
  --central-row-bg: #b9f6ca;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.lecturas-section {
  background: var(--secondary-bg);
  border-radius: 12px;
  box-shadow: 0 2px 12px #0002;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
  align-items: start;
  padding: 2rem;
}

h2 {
  color: var(--accent-dark);
  margin-bottom: 1em;
  font-size: 1.5em;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 1px;
  grid-row: 1;
  justify-self: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px #0001;
  grid-row: 2;
}

th {
  background: var(--table-header-bg);
  color: var(--table-header-text);
  font-weight: bold;
  padding: 0.7em;
  font-size: 1.1em;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--accent-light);
}

td {
  border-bottom: 2px solid var(--accent-light);
  padding: 0.6em;
  text-align: left;
  color: var(--text-secondary);
  font-size: 1em;
  font-family: inherit;
}

tr.central {
  background: var(--central-row-bg) !important;
}

tr:hover {
  background: var(--table-row-hover);
}

span {
  text-transform: none;
  color: var(--text-main);
  font-weight: 400;
  padding: 12px 0px 12px 10px;
}

div {
  color: var(--accent-dark);
  font-size: 2em;
  margin-bottom: 1em;
  grid-row: 2;
}

</style>