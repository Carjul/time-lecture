<template>
    <div class="container1">
        <h3>Buscar Posición</h3>

        <section>
            <h3>Inicializar</h3>
            <details>
                <summary>Instrucciones</summary>
                <p>Para empezar, ingresa el número consecutivo en la factura y su posición en simex.</p>
                <div class="form-group">
                    <label for="numero">Consecutivo</label>
                    <input type="text" id="numero" placeholder="Número de factura" v-model="consecutivo">
                    <label for="posicion">Clave</label>
                    <input type="text" id="posicion" placeholder="Posición en simex" v-model="pos">
                    <button @click="guardar()">Inicializar</button>
                </div>
            </details>
        </section>

        <section>
            <h3>Buscar</h3>
            <details>
                <summary>Buscar</summary>
                <div class="form-group">
                    <label for="buscar_posicion">Clave</label>
                    <input type="text" id="buscar_posicion" placeholder="Posición en simex" v-model="clave">
                    <button @click="buscar()">Buscar</button>
                </div>
                <div id="resultado" class="resultado">{{ result }}</div>
            </details>
        </section>

    </div>

</template>
<script setup>
import { ref } from 'vue';

var consecutivo = ref("");
var pos = ref("");
var clave = ref("");
var result = ref("");

function guardar() {
    localStorage.setItem("result", (parseInt(consecutivo.value) - parseInt(pos.value)));  
    consecutivo.value = "";
    pos.value = "";
}

function buscar() {
    result.value = parseInt(localStorage.getItem("result")) + parseInt(clave.value);
}

 
</script>
<style scoped>
/* Fuente limpia y márgenes globales */

/* Contenedor principal */
.container1 {
  background: #fff8e7;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Títulos */
h1 {
  text-align: center;
  color: #a85d00;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

h3 {
  color: #d17a00;
  margin-bottom: .5rem;
}

/* Formularios */
.form-group {
  display: flex;
  flex-direction: column;
  gap: .8rem;
  margin-top: 1rem;
}

label {
  font-weight: bold;
  color: #5a3c00;
  padding: 0.2rem 0;
}

input {
  padding: 0.6rem;
  border: 1px solid #e2c291;
  border-radius: 0.5rem;
  outline: none;
  transition: border 0.3s;
}

input:focus {
  border: 1px solid #d17a00;
  box-shadow: 0 0 5px rgba(209, 122, 0, 0.4);
}

/* Botones */
button {
  background: #ff9800;
  color: #fff;
  font-weight: bold;
  padding: 0.7rem;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #e68900;
}

.reset {
  background: #d9534f;
  margin-top: 1rem;
}

.reset:hover {
  background: #c9302c;
}

/* Resultados */
.resultado {
  margin-top: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
  color: #5a3c00;
  text-align: center;
  background: #ffe0b2;
  padding: 1rem;
  border-radius: 0.6rem;
}

</style>