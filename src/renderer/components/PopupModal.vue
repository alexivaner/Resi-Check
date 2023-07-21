<template>
  <div class="modal-background" v-if="showModal">
    <div class="modal-content">
      <p>{{ modalMessage }}</p>
      <button @click="closeModal">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    modalMessage: String,
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style>
/* Style the popup modal */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

button {
  margin-top: 10px;
}
</style>
