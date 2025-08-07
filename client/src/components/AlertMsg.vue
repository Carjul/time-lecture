<template>
  <div v-if="msg" class="alert">
    {{ msg }}
    <button class="close" @click="$emit('close')">×</button>
  </div>
</template>

<script setup>
defineProps({
  msg: String
})
</script>

<style scoped>
.alert {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 6px;
  padding: 0.7em 1.2em;
  margin: 0.5em auto;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.05em;
  box-shadow: 0 2px 8px #0001;
}
.close {
  background: none;
  border: none;
  color: #c62828;
  font-size: 1.3em;
  cursor: pointer;
  margin-left: 1em;
}
</style>