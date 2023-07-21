<template>
  <div>
    <div>
      <input
        v-model="textInput"
        type="text"
        placeholder="Masukkan resi"
        @focus="autoFillDateTime"
        @keyup.enter="addToTable"
      />
      <input v-model="dateInput" type="date" />
      <input
        v-model="hourInput"
        type="number"
        placeholder="Hour (0-23)"
        min="0"
        max="23"
      />
      <input
        v-model="minuteInput"
        type="number"
        placeholder="Minute (0-59)"
        min="0"
        max="59"
      />
      <button @click="addToTable">Add to Table</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Resi</th>
          <th>Tanggal</th>
          <th>Waktu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, textInput) in tableData" :key="textInput">
          <td>{{ textInput }}</td>
          <td>{{ entry.date }}</td>
          <td>{{ entry.time }}</td>
        </tr>
      </tbody>
    </table>
    <PopupModal
      v-if="showPopup"
      :showModal="showPopup"
      :modalMessage="popupMessage"
      @close="hidePopup"
    />
    <PopupModal
      v-if="showDuplicatePopup"
      :showModal="showDuplicatePopup"
      :modalMessage="duplicatePopupMessage"
      @close="hideDuplicatePopup"
    />
  </div>
</template>

<script>
import PopupModal from "./PopupModal.vue";

export default {
  data() {
    return {
      textInput: "",
      dateInput: "",
      hourInput: "",
      minuteInput: "",
      showPopup: false,
      popupMessage: "",
      showDuplicatePopup: false,
      duplicatePopupMessage: "",

      tableData: {}, // Change to an object
    };
  },
  methods: {
    addToTable() {
      if (
        this.textInput &&
        this.dateInput &&
        this.isHourValid(this.hourInput) &&
        this.isMinuteValid(this.minuteInput)
      ) {
        const formattedTime = this.formatTime(this.hourInput, this.minuteInput);
        const entryKey = this.textInput.toLowerCase().trim();
        if (this.tableData.hasOwnProperty(entryKey)) {
          this.showDuplicatePopup = true;
          this.duplicatePopupMessage = `Resi "${this.textInput}" sudah di-input tanggal ${this.tableData[entryKey].date} pukul ${this.tableData[entryKey].time}.`;
        } else {
          this.tableData[entryKey] = {
            date: this.dateInput,
            time: formattedTime,
          };
          this.textInput = "";
          this.autoFillDateTime();
        }
      } else {
        this.showPopup = true;
        this.popupMessage = "Hayo invalid. Pastiin jamnya bener deh";
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

    autoFillDateTime() {
      const now = new Date();
      this.dateInput = now.toISOString().slice(0, 10);
      this.hourInput = String(now.getHours()).padStart(2, "0");
      this.minuteInput = String(now.getMinutes()).padStart(2, "0");
    },
  },

  components: {
    PopupModal,
  },
};
</script>
