<template>
  <div class="modal-background" @click="closeModal">
    <div class="modal-content">
      <div class="close-icon" @click="closeModal">
        <i class="fa fa-times"></i>
      </div>
      <h2>About</h2>
      <p>Program ini dibuat simpel saja untuk memanajemen resi pengiriman Shopee.</p>
      <p>Created by Ivan Surya Hutomo</p>
      <button @click="checkForUpdates" class="update-button">
        <span> <i class="fas fa-refresh"></i> Check for updates</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$emit("close");
    },
    checkForUpdates() {
      // Add logic here to check for updates
      alert("Checking for updates...");
    },
  },
};
</script>

<style>

</style>
