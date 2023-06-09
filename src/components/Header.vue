<template>
  <div class='header-bg'>
    <header>
      <div class='header-info'>
        <img src='../assets/Logo.svg' alt='Logo' />
        <h1>Olá, {{ name }}!</h1>
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
  props: ['name'],
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
</style>