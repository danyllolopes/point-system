<template>
  <div class='header-bg'>
    <header class="header">
      <div class='header-info'>
        <img src='../assets/Logo.svg' alt='Logo' />
        <h1>Olá, {{ name }}!</h1>
      </div>
      <div class="header-btn">
       <button @click.prevent="logout"><img src="../assets/exit.png" alt="Logout"/></button>
      </div>
    </header>
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
  data: () => ({}),

  methods: {
    logout(){
      const url = window.location.href;
      window.localStorage.clear();
      window.location.reload();
      document.location.href = `${url}login`;
    }
  },
  props: ['name'],
};
</script>

<style scope>
.header-bg {
  background: #1E5084;
  min-height: 100vh;
}
.header {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.header-info {
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
.header-btn {
  display: flex;
  justify-content: center;
}
.header-btn img {
  width: 35px;
  height: 35px;
  padding: 5px;
}
.header-btn img:hover {
  border-radius: 15%;
  background: #5783b1;
  transition: all 0.4s;
}
</style>