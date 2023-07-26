<template>
  <div class="modal-background" v-if="showModal">
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

<style>
/* Common styles for both dark and light modes */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
}

button {
  margin-left: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Light mode styles */
@media (prefers-color-scheme: light) {
  .modal-background {
    background-color: rgba(255, 255, 255, 0.5);
  }
  .modal-content {
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  button {
    background-color: #007bff;
    color: #fff;
  }
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .modal-background {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    background-color: #1a1a1a;
    box-shadow: 0 2px 5px rgba(255, 255, 255, 0.3);
    color: #fff;
  }
  button {
    background-color: #535bf2;
    color: #fff;
  }
}
</style>
