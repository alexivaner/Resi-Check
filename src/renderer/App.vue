<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import TextInputTable from "./components/TextInputTable.vue";

window.electronAPI.sendMessage("Hello from App.vue!");
</script>

<template>
  <div>
    <h1>Resi Checker</h1>
  </div>
  <TextInputTable />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
