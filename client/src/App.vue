<template>
 
  <main>
    <RouterView />
  </main>
   <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/upload">upload</RouterLink>
  </nav>
</template>
<script setup>
</script>
<style scoped>
nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;

}
nav a {
  text-decoration: none;
  color: var(--text-main);
  font-weight: bold;
  padding: 0.1rem 0.1rem;
  border-radius: 4px;
  transition: background 0.3s;
}
nav a:hover {
  background: var(--accent-light);
}

</style>