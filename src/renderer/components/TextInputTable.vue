<template>
  <div class="query-container">
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
    <div class="search-container">
      <template v-if="selectedSearchColumn === 'provider'">
        <select v-model="providerQuery">
          <option value="">All</option>
          <option value="J&T Express">J&T Express</option>
          <option value="Pos Reguler">Pos Regular</option>
          <option value="ID Express">ID Express</option>
          <option value="JNE Regular">JNE Regular</option>
          <option value="JNE Trucking (JTR)">JNE Trucking (JTR)</option>
          <option value="J&T Cargo">J&T Cargo</option>
          <option value="Unknown Provider">Unknown Provider</option>
        </select>
      </template>
      <template v-else-if="selectedSearchColumn === 'date'">
        <div class="date-picker">
          <VueDatePicker
            v-model="dateRange"
            position="center"
            range
            :preset-ranges="presetRanges"
            :dark="isDarkMode"
          />
        </div>
      </template>
      <template v-else>
        <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan..." />
      </template>
      <select v-model="selectedSearchColumn">
        <option value="resiInput">Nomor Resi/Order</option>
        <option value="date">Tanggal</option>
        <option value="provider">Depo Pengiriman</option>
      </select>
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
      ref="nomorOrderRef"
      v-model="nomorOrder"
      type="text"
      @input="convertToUppercase"
      placeholder="Masukkan nomor order"
      @focus="autoFillDateTime"
      @keyup.enter="moveFocusToNextInput"
      maxlength="6"
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
    <label class="custom-checkbox">
      Lunas
      <input type="checkbox" v-model="lunas" />
      <span class="checkmark"></span>
    </label>
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
          <th @click="sortTable('nomorOrder')">
            Nomor Order
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'nomorOrder' && sortDirection === 1,
                desc: sortBy === 'nomorOrder' && sortDirection === -1,
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
          <th @click="sortTable('lunas')">
            Lunas
            <span
              class="sort-icon"
              :class="{
                asc: sortBy === 'lunas' && sortDirection === 1,
                desc: sortBy === 'lunas' && sortDirection === -1,
              }"
            ></span>
          </th>
          <th>Action Button</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, resiInput) in sortedTableData" :key="resiInput">
          <td>{{ resiInput }}</td>
          <td>{{ entry.nomorOrder }}</td>
          <td>{{ entry.date }}</td>
          <td>{{ entry.time }}</td>
          <td>{{ entry.provider }}</td>
          <td>{{ entry.hargaShopee }}</td>
          <td>{{ entry.hargaToko }}</td>
          <td>{{ entry.laba }}</td>
          <td>
            <!-- Conditionally render the checkmark (✓) or "x" based on the value of entry.lunas -->
            <span v-if="entry.lunas" class="check-mark">&#x2713;</span>
            <span v-else class="cross-mark">&#x2718;</span>
          </td>
          <!-- Display the Provider based on the provided information -->
          <td>
            <button @click="modifyEntry(resiInput)" class="icon-button">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteEntry(resiInput)" class="icon-button red-button">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <EditComponent
    v-if="editMode"
    :editMode="editMode"
    :modifiedEntry="modifiedEntry"
    @close="cancelModification"
    @confirm="saveModifiedEntry"
  />

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
import EditComponent from "./EditComponent.vue";
import Summary from "./Summary.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";

export default {
  mounted() {
    //Signal main process if it already mounted
    window.ipcRenderer.send("ready");
    window.ipcRenderer.receive("loadFromJson", (data) => {
      this.tableData = JSON.parse(data);
    });
  },
  data() {
    return {
      editMode: false,
      modifiedEntry: {},
      resiInput: "",
      nomorOrder: "",
      lunas: false,
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
      sortBy: "date",
      sortDirection: -1,
      appPath: "",
      isDarkMode: false, // Add a new data property to track the color scheme
      showAboutModal: false, // New data property to control the visibility of the about modal
      showSummaryModal: false,
      searchQuery: "", // New data property for search query,
      providerQuery: "",
      selectedSearchColumn: "resiInput", // New data property for selected search column
      dateRange: [], // New data property for date range selection
      presetRanges: [
        { label: "Hari ini", range: [new Date(), new Date()] },
        {
          label: "Minggu ini",
          range: [startOfWeek(new Date()), endOfWeek(new Date())],
        },
        {
          label: "Minggu lalu",
          range: [
            startOfWeek(subWeeks(new Date(), 1)),
            endOfWeek(subWeeks(new Date(), 1)),
          ],
        },
        {
          label: "Bulan ini",
          range: [startOfMonth(new Date()), endOfMonth(new Date())],
        },
        {
          label: "Bulan lalu",
          range: [
            startOfMonth(subMonths(new Date(), 1)),
            endOfMonth(subMonths(new Date(), 1)),
          ],
        },
        { label: "Tahun ini", range: [startOfYear(new Date()), endOfYear(new Date())] },
        {
          label: "Tahun ini (slot)",
          range: [startOfYear(new Date()), endOfYear(new Date())],
          slot: "yearly",
        },
      ],
    };
  },
  methods: {
    convertToUppercase() {
      this.nomorOrder = this.nomorOrder.toUpperCase();
    },

    addToTable(checkProvider = true) {
      if (
        this.resiInput &&
        this.nomorOrder &&
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
          } else if (this.nomorOrder.length !== 6 && checkProvider) {
            this.showConfirmationPopup = true;
            this.confirmationPopupMessage = `Nomor order "${this.nomorOrder}" tidak 6 digit. Masih ingin menambah data?`;
          } else {
            this.tableData[entryKey] = {
              nomorOrder: this.nomorOrder,
              date: this.dateInput,
              time: formattedTime,
              provider: this.getProviderFromText(this.resiInput), // Get the provider from the text input
              hargaShopee: this.hargaShopee ? this.hargaShopee : 0,
              hargaToko: this.hargaToko ? this.hargaToko : 0,
              laba: this.hargaShopee - this.hargaToko,
              lunas: this.lunas,
            };

            this.newlyAddedData[entryKey] = this.tableData[entryKey];
            window.ipcRenderer.send(
              "saveToJson",
              JSON.stringify(this.newlyAddedData, null, 2)
            );

            this.resiInput = "";
            this.nomorOrder = "";
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

    modifyEntry(resiInput) {
      this.modifiedEntry = { ...this.sortedTableData[resiInput] };
      this.modifiedEntry["resiInput"] = resiInput;
      this.editMode = true;
    },

    // Method to delete an entry from tableData
    deleteEntry(entryKey) {
      delete this.tableData[entryKey];
      window.ipcRenderer.send("deleteToJson", entryKey);
    },

    saveModifiedEntry(modifiedData, oldKey) {
      modifiedData.provider = this.getProviderFromText(modifiedData.resiInput);
      modifiedData.laba = modifiedData.hargaShopee - modifiedData.hargaToko;

      //TODO: Confirm input if provider is unknown, if user return yes then add

      //Confirm if modifiedData.resiInput already available
      // if (this.tableData.hasOwnProperty(modifiedData.resiInput)) {
      //   this.showDuplicatePopup = true;
      //   this.duplicatePopupMessage = `Resi "${
      //     modifiedData.resiInput
      //   }" sudah di-input tanggal ${this.tableData[modifiedData.resiInput].date} pukul ${
      //     this.tableData[modifiedData.resiInput].time
      //   }.`;
      //   return;
      // }

      //Delete old data first
      console.log("oldkey is", oldKey);
      delete this.tableData[oldKey];
      this.deleteEntry(oldKey);

      //Update input locally
      this.tableData[modifiedData.resiInput] = modifiedData;

      //Update input to json file
      const saveDataObject = {
        [modifiedData.resiInput]: modifiedData,
      };
      console.log("saveDataObject", saveDataObject);
      window.ipcRenderer.send("saveToJson", JSON.stringify(saveDataObject, null, 2));

      this.editMode = false; // Reset the selected index
      this.modifiedEntry = {}; // Reset the modified entry
    },
    cancelModification() {
      this.editMode = false; // Reset the selected index
      this.modifiedEntry = {}; // Reset the modified entry
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
        this.$refs.nomorOrderRef,
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
      // Update the class on the root element based on the color scheme
      document.documentElement.classList.toggle("dark-mode", this.isDarkMode);
      this.isDarkMode = await window.darkMode.toggle();
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
    EditComponent,
    VueDatePicker,
  },

  computed: {
    sortedTableData() {
      if (!this.sortBy) return this.tableData;
      let filteredData = [];

      if (this.selectedSearchColumn == "date" && this.dateRange) {
        // Get the start and end dates from the selected date range
        let startDate = null;
        if (this.dateRange[0]) {
          startDate = new Date(this.dateRange[0]);
          startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
        }

        let endDate = null;
        if (this.dateRange[1]) {
          endDate = new Date(this.dateRange[1]);
          endDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to end of day
        }

        // Filter the data based on the selected date range
        for (const key in this.tableData) {
          const dataDate = new Date(this.tableData[key].date);
          dataDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
          if (endDate === null) {
            endDate = startDate;
          }

          if (dataDate >= startDate && dataDate <= endDate) {
            filteredData.push([key, this.tableData[key]]); // Push the filtered data as an object to the array
          }
        }
      } else {
        filteredData = Object.entries(this.tableData).filter(([key, value]) => {
          let searchValue = null;
          if (this.selectedSearchColumn == "provider") {
            searchValue = this.providerQuery.toLowerCase().trim();
          } else {
            searchValue = this.searchQuery.toLowerCase().trim();
          }

          // Check if the key (resiInput) contains the search query
          if (key.toLowerCase().includes(searchValue)) {
            return true;
          }

          // Check if any of the other properties in the object contain the search query
          for (const property in value) {
            if (value.hasOwnProperty(property) && typeof value[property] === "string") {
              const dataValue = value[property].toString().toLowerCase().trim();
              if (dataValue.includes(searchValue)) {
                return true;
              }
            }
          }

          return false;
        });
      }

      return filteredData
        .sort((a, b) => {
          if (this.sortBy === "resiInput") {
            const aValue = a[0].toUpperCase().trim();
            const bValue = b[0].toUpperCase().trim();
            return aValue.localeCompare(bValue) * this.sortDirection;
          } else if (this.sortBy === "date" || this.sortBy === "time") {
            const aValue = a[1].date + " " + a[1].time;
            const bValue = b[1].date + " " + b[1].time;
            if (aValue === bValue) return 0;
            return aValue > bValue ? this.sortDirection : -this.sortDirection;
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
