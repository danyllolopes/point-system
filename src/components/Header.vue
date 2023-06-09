<template>
  <div class='header-bg'>
    <header>
      <div class='header-info'>
        <img src='../assets/Logo.svg' alt='Logo' />
        <h1>Olá, {{ name }}!</h1>
      </div>
    </header>
    <section class='info-time'>
      <h2>{{ currentDate }}</h2>
      <h2>{{ hour }}</h2>
      <h2>{{ time }}</h2>
    </section>
    <List />
  </div>
</template>

<script>
import List from './List.vue';

export default {
  name: 'Header',
  components: {
    List
  },
  data: () => ({    
    date: new Date(),
    hour: '00:00:00',
    time: 'Tempo 07:15:47'
  }),
  props: ['name'],
  computed: {
    currentDate() {
      const formatDate = this.date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return formatDate;
    },
  },
  methods: {
    currentTime() {
      setInterval(() => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        this.hour = `${hours}:${minutes}:${seconds}`;
      })
    }
  },
  mounted(){
    this.currentTime();
  }
};
</script>

<style scope>
.header-bg {
  background: #1E5084;
  min-height: 100vh;
}

.header-info {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  padding: 30px 0;
}

.header-info img {
  margin-right: 50px;
}

.header-info h1 {
  color: #fff;
  font-size: 1.875rem;
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
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
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
}
.info-time h2:nth-last-child(1){
  color: #FCCD2A;
} 
</style>