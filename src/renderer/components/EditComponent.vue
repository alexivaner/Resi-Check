<template>
  <div class="edit-form modal-background" v-if="editMode">
    <div class="modal-content2">
      <div class="input-container">
        <div class="input-child">
          <label
            >Nomor Resi
            <input
              ref="resiInputRef"
              v-model="dataEntry.resiInput"
              type="text"
              placeholder="Masukkan resi"
              @keyup.enter="moveFocusToNextInput"
            />
          </label>
        </div>
        <div class="input-child">
          <label
            >Nomor Order
            <input
              ref="nomorOrderRef"
              v-model="dataEntry.nomorOrder"
              type="text"
              placeholder="Masukkan nomor order"
              @input="convertToUppercase"
              maxlength="14"
              @keyup.enter="moveFocusToNextInput"
            />
          </label>
        </div>
        <div class="input-child">
          <label>
            Harga Shopee
            <input
              ref="hargaShopeeRef"
              v-model="dataEntry.hargaShopee"
              type="text"
              @input="preventTextDot('shopee')"
              placeholder="Masukkan harga shopee"
              @keyup.enter="moveFocusToNextInput"
            />
          </label>
        </div>
        <div class="input-child">
          <label>
            Harga Toko
            <input
              ref="hargaTokoRef"
              v-model="dataEntry.hargaToko"
              type="text"
              @input="preventTextDot('toko')"
              placeholder="Masukkan harga toko"
              @keyup.enter="moveFocusToNextInput"
            />
          </label>
        </div>
        <div class="input-child">
          <label>
            Tanggal
            <input
              ref="dateInputRef"
              v-model="dataEntry.date"
              type="date"
              @keyup.enter="moveFocusToNextInput"
            />
          </label>
        </div>
        <div class="input-child">
          <label>
            Waktu
            <input
              ref="timeInputRef"
              v-model="dataEntry.time"
              type="time"
              @keyup.enter="moveFocusToNextInput"
            />
          </label>
        </div>
        <div class="input-child">
          <label>
            Lunas
            <input type="checkbox" v-model="dataEntry.lunas" class="bigger-checkbox" />
          </label>
        </div>
        <div class="input-child">
          <button @click="saveModifiedEntry">Save</button>
          <button @click="cancelModification">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editMode: Boolean,
    modifiedEntry: Object,
  },
  data() {
    return {
      dataEntry: {},
      oldKey: "",
    };
  },
  mounted() {
    this.dataEntry = this.modifiedEntry;
    this.oldKey = this.modifiedEntry.resiInput;
  },
  methods: {
    cancelModification() {
      this.$emit("close");
    },
    preventTextDot(index) {
      console.log("index is %o", index);
      if (index == "shopee") {
        let current = this.dataEntry.hargaShopee;
        this.dataEntry.hargaShopee = current.replace(/[\D\.,]/g, "");
      } else {
        let current = this.dataEntry.hargaToko;
        this.dataEntry.hargaToko = current.replace(/[\D\.,]/g, "");
      }
    },
    convertToUppercase() {
      this.dataEntry.nomorOrder = this.dataEntry.nomorOrder.toUpperCase();
    },
    saveModifiedEntry() {
      this.$emit("confirm", this.dataEntry, this.oldKey);
    },
    autoFillDateTime() {
      const now = new Date();
      this.dataEntry.dateInput = now.toISOString().slice(0, 10);
      this.dataEntry.time =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");
    },
    moveFocusToNextInput(event) {
      const inputRef = event.target;
      const nextInputRef = inputRef.nextElementSibling;
      if (nextInputRef) {
        nextInputRef.focus();
      }
    },
  },
};
</script>

<style>
.input-container {
  display: block;
  flex-direction: row;
  justify-content: space-between;
}

.input-child {
  margin: 20px;
  float: left;
}

.bigger-checkbox {
  /* Increase the height and width of the checkbox */
  height: 24px;
  width: 24px;
  /* Optional: Add margin or padding to adjust spacing around the checkbox */
  margin-right: 10px;
  /* Hide the default checkbox */
}

.button-container {
  justify-content: center;
  margin-top: 20px;
}

/* Additional styles to align buttons horizontally */
.button-container button {
  margin: 0 10px;
}
</style>
