<template>
  <section>
    <div class="info-time">
      <h2>{{ currentDate }}</h2>
      <h2>{{ hour }}</h2>
      <h2>Tempo {{ time }}</h2>
    </div>
    <div class="list-button">
      <button :disabled="disable.start"  @click.prevent="submitStart">Cheguei</button>
      <button :disabled="disable.startLunch" @click.prevent="udpateTimesheet">Fui Almoçar</button>
      <button :disabled="disable.endLunch"   @click.prevent="udpateTimesheet">Voltei</button>
      <button :disabled="disable.end" @click.prevent="udpateTimesheet">Fui</button>
    </div>

    <template>
      <v-data-table
        class="list-table"
        :headers="headers"
        :items="items"
        :items-per-page="5"
        item-key="items.id"
        sort-by.sync="start"
      >
      </v-data-table>
    </template>
    <Loading :loading="loading" />
  </section>
</template>

<script>
import Loading from "./Loading.vue";
import { api } from "../services/request";
import moment from "moment";

export default {
  name: "List",
  components: {
    Loading,
  },
  data: () => ({
    loading: false,
    filter: {},
    disable: {
      start: false,
      startLunch: false,
      endLunch: false,
      end: false,
    },
    headers: [
      {
        text: "Data",
        value: "date",
      },
      {
        text: "Hora Início",
        value: "start",
        sortBy: "start",
      },
      {
        text: "Almoço Início",
        value: "startLunch",
      },
      {
        text: "Almoço Fim",
        value: "endLunch",
      },
      {
        text: "Hora Fim",
        value: "end",
      },
      {
        text: "Tempo",
        value: "time",
      },
    ],
    items: [],
    date: new Date(),
    hour: "00:00:00",
    time: "00:00:00",
    sec: 0,
    min: 0,
    hr: 0,
    interval: null,
  }),

  methods: {
    async pullTimesheet() {
      try {
        const { data } = await api.get("/Timesheet");
        if (data.items.length > 0) {
          this.formatDateTime(data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async submitStart() {
      try {
        this.loading = true;

        const currentTime = new Date().toISOString();
        const { data } = await api.post("/Timesheet", {
          start: currentTime,
          startLunch: null,
          endLunch: null,
          end: null,
        });
        if (data.id) {
          await this.pullTimesheet();
          this.startTime();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async udpateTimesheet() {
      try {
        this.loading = true;
        this.formatParamsUpdateTimesheet();
        await api.put(`/Timesheet/${this.filter.id}`, {
          startLunch: this.filter.startLunch,
          endLunch: this.filter.endLunch,
          end: this.filter.end,
        });
        await this.pullTimesheet();
        this.disableButton();
        if (this.filter.startLunch) {
          this.stopTime();
        }
        if (this.filter.endLunch) {
          this.startTime();
        }
        if (this.filter.end) {
          this.stopTime();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    formatDateTime({ items }) {
      let date = "";
      let start = "";
      let startLunch = "";
      let endLunch = "";
      let end = "";

      for (let item in items) {
        if (items[item].start) {
          date = moment(items[item].start).format("DD/MM/YYYY");
          start = moment(items[item].start).add(3, "hours").format("HH:mm:ss");
        }
        if (items[item].startLunch) {
          startLunch = moment(items[item].startLunch).format("HH:mm:ss");
        }
        if (items[item].endLunch) {
          endLunch = moment(items[item].endLunch).format("HH:mm:ss");
        }
        if (items[item].end) {
          end = moment(items[item].end).format("HH:mm:ss");
        }

        const inicio = moment(start, "HH:mm:ss");
        const almoco = moment(startLunch, "HH:mm:ss");
        const voltaAlmoco = moment(endLunch, "HH:mm:ss");
        const final = moment(end, "HH:mm:ss");
        const time =
          moment.duration(almoco.diff(inicio)).asHours() +
          moment.duration(final.diff(voltaAlmoco)).asHours();

        const horas = Math.floor(time);
        const minutosDecimais = time - horas;
        const minutos = Math.floor(minutosDecimais * 60);
        const segundosDecimais = minutosDecimais * 60 - minutos;
        const segundos = Math.round(segundosDecimais * 60);
        const formatoHoras = `${horas}:${minutos < 10 ? "0" : ""}${minutos}:${
          segundos < 10 ? "0" : ""
        }${segundos}`;

        this.items.push({
          id: items[item].id,
          date: date ? date : null,
          start: start ? start : null,
          startLunch: startLunch ? startLunch : null,
          endLunch: endLunch ? endLunch : null,
          end: end ? end : null,
          time: formatoHoras ? formatoHoras : null,
        });
      }
      this.disableButton();
    },
    formatParamsUpdateTimesheet() {
      this.items.reduce((acc, cv) => {
        acc = Math.max(acc, cv.id);
        if (acc === cv.id) {
          this.filter = cv;
        }
      }, -Infinity);
      const currentTime = new Date().toISOString();

      if (this.filter.startLunch === null) {
        this.filter.startLunch = currentTime;
      } else if (this.filter.endLunch === null) {
        this.filter.endLunch = currentTime;
      } else if (this.filter.end === null) {
        this.filter.end = currentTime;
      }
    },

    disableButton() {
      const now = new Date().toLocaleDateString("pt-BR");
      this.items.filter((item) => {
        if (item.date === now) {
          if (item.start !== null) {
            this.disable.start = true;
          }
          if (item.startLunch !== null) {
            this.disable.startLunch = true;
          }
          if (item.endLunch !== null) {
            this.disable.endLunch = true;
          }
          if (item.end !== null) {
            this.disable.end = true;
          }
        }
      });
    },
    currentTime() {
      setInterval(() => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (hours < 10) {
          hours = `0${hours}`;
        }
        if (minutes < 10) {
          minutes = `0${minutes}`;
        }
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        this.hour = `${hours}:${minutes}:${seconds}`;
      });
    },
    startTime() {
      this.interval = setInterval(this.watch, 1000);
    },
    stopTime() {
      clearInterval(this.interval);
    },
    watch() {
      this.sec++;
      if (this.sec === 60) {
        this.min++;
        this.sec = 0;
        if (this.min === 60) {
          (this.min = 0), this.hr++;
        }
      }
      this.time = `${this.formatTime(this.hr)}:${this.formatTime(
        this.min
      )}:${this.formatTime(this.sec)}`;
    },
    formatTime(digit) {
      if (digit < 10) {
        return `0${digit}`;
      } else {
        return digit;
      }
    },
  },
  computed: {
    currentDate() {
      const formatDate = this.date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return formatDate;
    },
  },
  async mounted() {
    this.currentTime();
    await this.pullTimesheet();
  },
};
</script>

<style scoped>
.list-button {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 50px;
}

.list-button button {
  font-family: "Open Sans", sans-serif;
  font-size: 1.5rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #fff;
  border: 3px solid #fccd2a;
  border-radius: 5px;
  padding: 10px 24px;
  transition: all 0.2s;
  margin-bottom: 30px;
}

.list-button button:hover {
  background: #fccd2a;
  color: #1e5084;
}

.list-table {
  max-width: 1150px;
  margin: 0 auto;
}

.info-time {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-bottom: 30px;
}
.info-time h2 {
  color: #fff;
  font-size: 1.562rem;
  font-family: "Open Sans", sans-serif;
  font-weight: bold;
}
.info-time h2:nth-last-child(1) {
  color: #fccd2a;
}
</style>
