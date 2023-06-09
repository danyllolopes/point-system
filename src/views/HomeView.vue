<template>
  <div>
    <Header :name='name'/>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

  export default {
    components: {
      Header,
    },
    data: () => ({
      name: ''
  }),
    created(){
      this.name = window.localStorage.name;
    }
  }
</script>
<style scoped>
</style>