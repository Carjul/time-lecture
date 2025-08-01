<template>
  <section class="lecturas-section">
    <h2>Listado de Lecturas</h2>
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
      (key) => key !== '_id' && key !== 'CRUCE'
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
.lecturas-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th {
  background: #696868;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem;
}

td {
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  text-align: left;
  font-size: 0.95rem;
}

span,
h2,
div {
  text-transform: capitalize;
  color: black;
  font-size: bold;
}

.central {
  background: #198f3b !important;
}

@media (max-width: 600px) {

  th,
  td {
    font-size: 0.8rem;
    padding: 0.3rem;
  }
}
</style>