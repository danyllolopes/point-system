<template>
  <loader v-if="loading" object="#1E5084" color1="#FCCD2A" color2="#17fd3d" size="5" speed="2" bg="#343a40"
    objectbg="#999793" opacity="80" disableScrolling="false" name="spinning">
  </loader>
</template>

<script>
export default {
  name: 'Loading',
  props: ['loading']
}
</script>

<style scoped></style>