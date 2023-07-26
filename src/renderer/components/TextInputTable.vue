<template>
  <div>
    <!-- Add a button to toggle between dark and light mode -->
    <div class="switch-scheme-button">
      <button @click="toggleSummaryModal">
        <span> <i class="fa fa-bar-chart"></i> Summary</span>
      </button>
      <button @click="toggleColorScheme">
        <span v-if="isDarkMode"> <i class="fas fa-sun"></i> Light Mode </span>
        <span v-else> <i class="fas fa-moon"></i> Dark Mode </span>
      </button>

      <button @click="setSystemMode">Match System</button>
      <button @click="toggleAboutModal">
        <span> <i class="fas fa-info-circle"></i> About</span>
      </button>
    </div>

    <input
      ref="resiInputRef"
      v-model="resiInput"
      type="text"
      placeholder="Masukkan resi"
      @focus="autoFillDateTime"
      @keyup.enter="moveFocusToNextInput"
    />
    <input
      ref="hargaShopeeRef"
      v-model="hargaShopee"
      type="number"
      placeholder="Masukkan harga shopee"
      @focus="autoFillDateTime"
      @keyup.enter="moveFocusToNextInput"
    />
    <input
      ref="hargaTokoRef"
      v-model="hargaToko"
      type="number"
      placeholder="Masukkan harga toko"
      @focus="autoFillDateTime"
      @keyup.enter="addToTable"
    />
    <input v-model="dateInput" type="date" />
    <input v-model="hourInput" type="number" placeholder="Hour (0-23)" min="0" max="23" />
    <input
      v-model="minuteInput"
      type="number"
      placeholder="Minute (0-59)"
      min="0"
      max="59"
    />
    <button @click="addToTable">Masukkan Data</button>
  </div>
  <div class="tableFixHead">
    <table>
      <thead>
        <tr>
          <th @click="sortTable('resiInput')">
            Resi
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'resiInput' && sortDirection === 1,
                desc: sortBy === 'resiInput' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th @click="sortTable('date')">
            Tanggal
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'date' && sortDirection === 1,
                desc: sortBy === 'date' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th @click="sortTable('time')">
            Waktu
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'time' && sortDirection === 1,
                desc: sortBy === 'time' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th @click="sortTable('provider')">
            Depo Pengiriman
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'provider' && sortDirection === 1,
                desc: sortBy === 'provider' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th @click="sortTable('hargaShopee')">
            Harga Shopee
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'hargaShopee' && sortDirection === 1,
                desc: sortBy === 'hargaShopee' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th @click="sortTable('hargaToko')">
            Harga Toko
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'hargaToko' && sortDirection === 1,
                desc: sortBy === 'hargaToko' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th @click="sortTable('laba')">
            Laba
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'laba' && sortDirection === 1,
                desc: sortBy === 'laba' && sortDirection === -1,
              }"
            ></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, resiInput) in sortedTableData" :key="resiInput">
          <td>{{ resiInput }}</td>
          <td>{{ entry.date }}</td>
          <td>{{ entry.time }}</td>
          <td>{{ entry.provider }}</td>
          <td>{{ entry.hargaShopee }}</td>
          <td>{{ entry.hargaToko }}</td>
          <td>{{ entry.laba }}</td>
          <!-- Display the Provider based on the provided information -->
        </tr>
      </tbody>
    </table>
  </div>

  <PopupModal
    v-if="showPopup"
    :showModal="showPopup"
    :modalType="modalType[1]"
    :modalMessage="popupMessage"
    @close="hidePopup"
  />
  <PopupModal
    v-if="showDuplicatePopup"
    :showModal="showDuplicatePopup"
    :modalMessage="duplicatePopupMessage"
    :modalType="modalType[1]"
    @close="hideDuplicatePopup"
  />
  <PopupModal
    v-if="showConfirmationPopup"
    :showModal="showConfirmationPopup"
    :modalMessage="confirmationPopupMessage"
    :modalType="modalType[0]"
    @confirm="confirmAddToTable"
    @close="cancelAddToTable"
  />
  <!-- Display the AboutModal component when the about modal should be visible -->
  <AboutModal v-if="showAboutModal" @close="closeAboutModal" />
  <Summary
    v-if="showSummaryModal"
    :modifiedTableData="tableData"
    :isDarkMode="isDarkMode"
    @close="closeSummaryModal"
  />
  <!-- Add a router link to navigate to the Summary page -->
</template>

<script>
import PopupModal from "./PopupModal.vue";
import { providerRegexes } from "../../helper/providers"; // Import the providerRegexes from the external file
import AboutModal from "./AboutModal.vue";
import Summary from "./Summary.vue";

export default {
  mounted() {
    //Signal main process if it already mounted
    window.ipcRenderer.send("ready");
    window.ipcRenderer.receive("loadFromJson", (data) => {
      console.log("Load from JSON",data);
      this.tableData = JSON.parse(data);
    });
  },
  data() {
    return {
      resiInput: "",
      hargaShopee: null,
      hargaToko: null,
      dateInput: "",
      hourInput: "",
      minuteInput: "",
      showPopup: false,
      popupMessage: "",
      showDuplicatePopup: false,
      duplicatePopupMessage: "",
      showConfirmationPopup: false,
      confirmationPopupMessage: "",
      providerRegexes: providerRegexes, // Assign the imported dictionary to the data property
      tableData: {}, // Change to an object
      newlyAddedData: {}, //newly added data for add to json file
      modalType: ["confirmation", "warning"],
      sortBy: null,
      sortDirection: 1,
      appPath: "",
      isDarkMode: false, // Add a new data property to track the color scheme
      showAboutModal: false, // New data property to control the visibility of the about modal
      showSummaryModal: false,
    };
  },
  methods: {
    addToTable(checkProvider = true) {
      if (
        this.resiInput &&
        this.dateInput &&
        this.isHourValid(this.hourInput) &&
        this.isMinuteValid(this.minuteInput)
      ) {
        const formattedTime = this.formatTime(this.hourInput, this.minuteInput);
        const entryKey = this.resiInput.toUpperCase().trim();
        if (this.tableData.hasOwnProperty(entryKey)) {
          this.showDuplicatePopup = true;
          this.duplicatePopupMessage = `Resi "${this.resiInput}" sudah di-input tanggal ${this.tableData[entryKey].date} pukul ${this.tableData[entryKey].time}.`;
        } else {
          const provider = this.getProviderFromText(this.resiInput);
          if (provider === "Unknown Provider" && checkProvider) {
            this.showConfirmationPopup = true;
            this.confirmationPopupMessage = `Provider pengiriman "${this.resiInput}" tidak diketahui. Masih ingin menambah data?`;
          } else {
            this.tableData[entryKey] = {
              date: this.dateInput,
              time: formattedTime,
              provider: this.getProviderFromText(this.resiInput), // Get the provider from the text input
              hargaShopee: this.hargaShopee ? this.hargaShopee : 0,
              hargaToko: this.hargaToko ? this.hargaToko : 0,
              laba: this.hargaShopee - this.hargaToko,
            };

            this.newlyAddedData[entryKey] = this.tableData[entryKey];
            window.ipcRenderer.send(
              "saveToJson",
              JSON.stringify(this.newlyAddedData, null, 2)
            );

            this.resiInput = "";
            this.resiInput = "";
            this.hargaShopee = null;
            this.hargaToko = null;
            this.autoFillDateTime();
          }
        }
      } else {
        this.showPopup = true;
        this.popupMessage = "Hayo check lagi datanya!";
      }
    },
    isHourValid(hour) {
      const parsedHour = parseInt(hour);
      return !isNaN(parsedHour) && parsedHour >= 0 && parsedHour < 24;
    },
    isMinuteValid(minute) {
      const parsedMinute = parseInt(minute);
      return !isNaN(parsedMinute) && parsedMinute >= 0 && parsedMinute < 60;
    },
    formatTime(hour, minute) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      return `${formattedHour}:${formattedMinute}`;
    },

    hidePopup() {
      this.showPopup = false;
    },

    hideDuplicatePopup() {
      this.showDuplicatePopup = false;
    },

    // Confirm adding to the table if the user confirms in the popup
    confirmAddToTable() {
      this.showConfirmationPopup = false;
      this.addToTable(false);
    },

    // Cancel adding to the table if the user cancels in the popup
    cancelAddToTable() {
      this.showConfirmationPopup = false;
    },

    autoFillDateTime() {
      const now = new Date();
      this.dateInput = now.toISOString().slice(0, 10);
      this.hourInput = String(now.getHours()).padStart(2, "0");
      this.minuteInput = String(now.getMinutes()).padStart(2, "0");
    },

    // Helper method to extract provider based on the given text input
    getProviderFromText(resiInput) {
      for (const [provider, regex] of Object.entries(this.providerRegexes)) {
        if (regex.test(resiInput)) {
          return provider;
        }
      }
      return "Unknown Provider";
    },

    moveFocusToNextInput(event) {
      const inputs = [
        this.$refs.resiInputRef,
        this.$refs.hargaShopeeRef,
        this.$refs.hargaTokoRef,
      ];
      const currentInputIndex = inputs.findIndex((input) => input === event.target);
      if (currentInputIndex >= 0 && currentInputIndex < inputs.length - 1) {
        inputs[currentInputIndex + 1].focus();
      } else {
        this.addToTable();
      }
    },

    sortTable(column) {
      if (this.sortBy === column) {
        this.sortDirection *= -1;
      } else {
        this.sortBy = column;
        this.sortDirection = 1;
      }
    },
    // Method to toggle between dark and light mode
    async toggleColorScheme() {
      this.isDarkMode = await window.darkMode.toggle();

      // Update the class on the root element based on the color scheme
      document.documentElement.classList.toggle("dark-mode", this.isDarkMode);
    },

    // Method to set the color scheme to match the system
    async setSystemMode() {
      this.isDarkMode = await window.darkMode.system();
    },

    // Method to show the about modal
    async toggleAboutModal() {
      this.showAboutModal = true;
    },

    // Method to close the about modal
    closeAboutModal() {
      this.showAboutModal = false;
    },

    // Method to show the about modal
    async toggleSummaryModal() {
      this.showSummaryModal = true;
    },

    // Method to close the about modal
    closeSummaryModal() {
      this.showSummaryModal = false;
    },
  },

  components: {
    PopupModal,
    AboutModal,
    Summary,
  },

  computed: {
    sortedTableData() {
      if (!this.sortBy) return this.tableData;

      return Object.entries(this.tableData)
        .sort((a, b) => {
          if (this.sortBy === "resiInput") {
            const aValue = a[0].toUpperCase().trim();
            const bValue = b[0].toUpperCase().trim();
            return aValue.localeCompare(bValue) * this.sortDirection;
          } else {
            const aValue = a[1][this.sortBy];
            const bValue = b[1][this.sortBy];
            if (aValue === bValue) return 0;
            return aValue > bValue ? this.sortDirection : -this.sortDirection;
          }
        })
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
    },
  },
};
</script>
