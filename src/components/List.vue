<template>
  <section>
    <div class="list-button">
      <button @click.prevent="submitStart">Cheguei</button>
      <button @click.prevent="udpateTimesheet">Fui Almoçar</button>
      <button @click.prevent="udpateTimesheet">Voltei</button>
      <button @click.prevent="udpateTimesheet">Fui</button>
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
  }),

  methods: {
    async pullTimesheet() {
      try {
        const { data } = await api.get("/Timesheet");
        if (data.items.length > 0) {
          this.formatDateTime(data)
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
        console.log("filter", this.filter);
        await api.put(`/Timesheet/${this.filter.id}`, {
          startLunch: this.filter.startLunch,
          endLunch: this.filter.endLunch,
          end: this.filter.end,
        });
        await this.pullTimesheet();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    formatDateTime({items}){       
      let formatStart = "";
      let date = "";
      let start = "";

      let formatStartLunch = "";  
      let startLunch = "";
      
      let formatEndLunch = "";
      let endLunch = "";
      
      let formatEnd = "";
      let end = "";
      
      console.log(items)
      for(let item in items){
        console.log('entrou aqui')
        if (items[item].start) {
          formatStart = items[item].start.split("T");
          date = moment(formatStart[0]).format("DD/MM/YYYY");
          start = formatStart[1].split(".");
        } 
        if (items[item].startLunch) {
          formatStartLunch = items[item].startLunch.split("T");        
          startLunch = formatStartLunch[1].split(".");
        } 
         if (items[item].endLunch) {
          formatEndLunch = items[item].endLunch.split("T");     
          endLunch = formatEndLunch[1].split(".");
        } 
         if (items[item].end) {
          formatEnd = items[item].end.split("T");         
          end = formatEnd[1].split(".");
        }

        this.items.push({
            id: items[item].id,
            date: date ? date : null,
            start: start ? start : null,
            startLunch: startLunch ? startLunch : null,
            endLunch: endLunch ? endLunch : null,
            end: end ? end : null,
          });
      }

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
  },
  async mounted() {
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

.list-table-header {
  background: #1e5084 !important;
}

.list-table-header th {
  color: #fccd2a !important;
  font-size: 1.25rem !important;
  text-transform: uppercase;
  font-family: "Open Sans", sans-serif;
}

.list-table-body tr {
  background: blue !important;
}

.list-table-body td {
  border-right: 1px solid #1e5084 !important;
  border-bottom: 2px solid #1e5084 !important;
}
</style>
