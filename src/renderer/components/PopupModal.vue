<template>
  <div class="modal-background" @click="closeModal" v-if="showModal">
    <div class="modal-content">
      <p>{{ modalMessage }}</p>
      <div v-if="modalType == 'confirmation'" class="modal-buttons">
        <button @click="closeModal">Cancel</button>
        <button @click="confirmModal">Confirm</button>
      </div>
      <div v-if="modalType == 'warning'" class="modal-buttons">
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    modalMessage: String,
    modalType: String, //[confirmation, warning]
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    confirmModal() {
      this.$emit("confirm");
      this.closeModal();
    },
  },
};
</script>

<style></style>
