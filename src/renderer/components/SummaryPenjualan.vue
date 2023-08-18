<template>
  <div class="modal-background">
    <div class="modal-content">
      <div class="close-icon" @click="closeModal">
        <i class="fa fa-times"></i>
      </div>
      <div class="depo-pengiriman-chart">
        <h1>Summary Penjualan</h1>
        <h2>Set range tanggal input resi</h2>
        <VueDatePicker
          v-model="date"
          position="center"
          @update:model-value="handleDate"
          range
          :preset-ranges="presetRanges"
          :dark="isDarkMode"
        />
        <br />
        <canvas class="chart" ref="chart" width="900" height="400"></canvas>
        <div class="sumary-data-container">
          <div class="total-laba">
            <span>
              <h3>Total Laba</h3>
              <p style="font-size: 25px">{{ totalLaba }}</p></span
            >
          </div>
          <div class="total-laba">
            <span>
              <h3>Total Resi Lunas (*)</h3>
              <p style="font-size: 25px">{{ totalLunas }} Resi</p></span
            >
          </div>
          <div class="total-laba">
            <span>
              <h3>Total Belum Lunas (*)</h3>
              <p style="font-size: 25px">{{ totalBelumLunas }} Resi</p></span
            >
          </div>
        </div>
        <div style="margin-bottom:20px">
          <span
            >*Resi lunas, dan belum lunas pada summary ini adalah berdasarkan tanggal
            input resi, bukan tanggal pelunasan.</span
          >
        </div>
        <!-- Increased width and height -->
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the datalabels plugin
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
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

Chart.register(...registerables);
Chart.register(ChartDataLabels); // Register the datalabels plugin

export default {
  components: { VueDatePicker },

  props: {
    modifiedTableData: Object,
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.filteredData = this.modifiedTableData;
    this.createBarChart();
  },
  data() {
    return {
      date: null,
      filteredData: null, // Add a new data property to store the filtered data
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
  computed: {
    providerCounts() {
      const data = this.filteredData; // Use filteredData if available

      const counts = {};

      for (const key in data) {
        const provider = data[key].provider;
        if (provider in counts) {
          counts[provider]++;
        } else {
          counts[provider] = 1;
        }
      }

      return counts;
    },

    totalLaba() {
      let total = 0;
      for (const key in this.filteredData) {
        total += this.filteredData[key].laba;
      }
      return total.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    },

    totalLunas() {
      let total = 0;
      for (const key in this.filteredData) {
        if (this.filteredData[key].lunas) {
          total += 1;
        }
      }
      return total;
    },

    totalBelumLunas() {
      let total = 0;
      for (const key in this.filteredData) {
        if (!this.filteredData[key].lunas) {
          total += 1;
        }
      }
      return total;
    },
  },
  methods: {
    handleDate() {
      console.log("Date in summary", this.date);

      // Get the start and end dates from the selected date range
      let startDate = null;

      if (this.date[0]) {
        startDate = new Date(this.date[0]);
        startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
      }

      let endDate = null;
      if (this.date[1]) {
        endDate = new Date(this.date[1]);
        endDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to end of day
      }

      // Filter the data based on the selected date range
      this.filteredData = {};
      for (const key in this.modifiedTableData) {
        const dataDate = new Date(this.modifiedTableData[key].date);
        dataDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
        if (endDate == null) {
          endDate = startDate;
        }

        if (dataDate >= startDate && dataDate <= endDate) {
          this.filteredData[key] = this.modifiedTableData[key];
        }
      }

      // Recreate the bar chart with the filtered data
      this.createBarChart();
    },
    createBarChart() {
      const providerLabels = Object.keys(this.providerCounts);
      const providerData = Object.values(this.providerCounts);

      const ctx = this.$refs.chart.getContext("2d");

      // Check if a Chart instance already exists on the canvas
      if (this.chartInstance) {
        // Destroy the existing Chart instance
        this.chartInstance.destroy();
      }

      // Define an array of colors
      const colors = [
        "rgba(255, 99, 132, 0.6)", // Red
        "rgba(54, 162, 235, 0.6)", // Blue
        "rgba(75, 192, 192, 0.6)", // Green
        // Add more colors as needed
      ];

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: providerLabels,
          datasets: [
            {
              label: "# of Depo Pengiriman",
              data: providerData,
              backgroundColor: colors, // Assign the colors to the dataset
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              // Customize the font size for x-axis labels
              ticks: {
                font: {
                  size: 18,
                },
              },
            },
          },
          layout: {
            padding: 30,
          },
          onClick: this.handleBarClick, // Attach the click event handler
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
            datalabels: {
              anchor: "end",
              align: "top",
              font: {
                size: 20, // Customize the font size
              },
              formatter: (value) => {
                // Show the data values on top of each bar
                return value;
              },
            },
          },
        },
      });
    },

    handleBarClick(event) {
      // Get the clicked dataset and index
      const res = this.chartInstance.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      );
      // If didn't click on a bar, `res` will be an empty array
      if (res.length === 0) {
        return;
      }

      // Get the label and index of the clicked bar
      const provider = this.chartInstance.data.labels[res[0].index];

      console.log("Provider is: %o", provider);

      const dateRange = this.date;

      // Emit the click event data to the parent component
      this.$emit("bar-click", { provider, dateRange });
    },

    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style>
/* Add styles for the close icon */

/* Additional styles for the modal view */
.modal-background {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    36,
    36,
    36,
    0.8
  ) !important; /* Semi-transparent black background */
  z-index: 9999; /* Ensure the modal is on top of other elements */
}

.modal-content {
  max-width: 1280px !important; /* Set a maximum width for the modal */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.sumary-data-container {
  display: flex;
  justify-content: space-between;
  align-items: left;
  margin: 10px 50px 10px 50px;
}
</style>
