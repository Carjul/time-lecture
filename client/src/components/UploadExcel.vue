<template>
  <section class="upload-section">
    <h2>Subir archivo Excel</h2>
    <form @submit.prevent="handleUpload">
      <input
        type="file"
        accept=".xlsx,.xlsm"
        @change="onFileChange"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Subiendo...' : 'Subir' }}
      </button>
    </form>
    <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['uploaded'])

const file = ref(null)
const loading = ref(false)
const message = ref('')
const success = ref(false)

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function handleUpload() {
  if (!file.value) return
  loading.value = true
  message.value = ''
  success.value = false
  const formData = new FormData()
  formData.append('document', file.value)
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    if (!res.ok) throw new Error(await res.text())
    message.value = 'Archivo subido correctamente'
    success.value = true
    emit('uploaded')
  } catch (err) {
    message.value = 'Error al subir el archivo: ' + err.message
    success.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-section {
  background: #f8f8f8;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  max-width: 400px;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.success {
  color: #2e7d32;
}
.error {
  color: #c62828;
}
</style>