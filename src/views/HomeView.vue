<template>
  <div>
    <Header :name="name" />
  </div>
</template>

<script>
import Header from "../components/Header.vue";

export default {
  components: {
    Header,
  },
  data: () => ({
    name: "",
  }),
  methods: {
    validateToken() {
      const now = new Date().getTime();
      const tokenExpiresIn = window.localStorage.expiresIn;
      const url = window.location.href;
      if (tokenExpiresIn < now) {
        window.localStorage.clear();
        window.location.reload();
        document.location.href = `${url}login`;
      }
    },
  },
  created() {
    this.validateToken();
    const firstName = window.localStorage.name;
    const formatName = firstName.split(' ');   
    this.name = formatName[0];
  },
};
</script>
<style scoped></style>
