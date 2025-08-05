<template>
  <div class="container">
    <header>
      <h1>Tiempos de Lectura</h1>
    </header>
    <main>
      <section class="busqueda">
        <select v-model="rango">
          <option v-for="n in rangos" :key="n" :value="n">{{ n }}</option>
        </select>
        <input
          type="number"
          v-model="num"
          placeholder="Ingrese NIC o Medidor"
          min="0"
        />
        <button @click="fetchLecturas">Buscar</button>
      </section>
    
      <LecturasList :lecturas="lecturas" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LecturasList from '../components/LecturasList.vue'

const lecturas = ref([])
const num = ref('')
const rango = ref(10)
const rangos = [10, 20, 30, 40, 50, 60]

const fetchLecturas = async () => {
  if (!num.value) return
  const res = await fetch(`/api/lecturas?num=${num.value}&rango=${rango.value}`)
  const data = await res.json()
  lecturas.value = data
}

onMounted(fetchLecturas)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
}
header {
  text-align: center;
  margin-bottom: 2rem;
}
main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.busqueda {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}
.busqueda select,
.busqueda input {
  padding: 0.5rem;
  font-size: 1rem;
}
.busqueda input {
  width: 180px;
}
.busqueda button {
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.busqueda button:hover {
  background: #369870;
}
@media (max-width: 600px) {
  .container {
    padding: 0.5rem;
  }
  .busqueda {
    flex-direction: column;
    gap: 0.5rem;
  }
  .busqueda input,
  .busqueda select {
    width: 100%;
  }
}
</style>