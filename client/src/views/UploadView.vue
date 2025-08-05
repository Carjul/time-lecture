<template>
    <main>
        <h1></h1>
        <UploadExcel @uploaded="fetchLecturas" />
    </main>
</template>
<script setup>
import UploadExcel from '../components/UploadExcel.vue'
</script>