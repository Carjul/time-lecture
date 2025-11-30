<template>
    <main class="calcularpos">
    <CalcularPos />
    </main>
</template>
<script setup>
import CalcularPos from '../components/Calcularpos.vue'
</script>
<style scoped>  
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.calcularpos{
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fceabb, #f8b500);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}
</style>