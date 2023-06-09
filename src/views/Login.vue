<template>
  <section class="login">
    <div class="container">
      <form class="form">
        <h1>Login</h1>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" v-model="userID" />

        <label for="password">Senha</label>
        <input type="password" name="password" id="password" v-model="accessKey" />
        <button :disabled="disabledButton" @click.prevent="submit">Logar</button>
      </form>
      <img src="../assets/LogoLogin.svg" alt="Logo" />
      <Loading :loading="loading"/>
    </div>
  </section>
</template>

<script>
import { api } from '../services/request';
import Loading from '../components/Loading.vue';

export default {
  name: 'Login',
  components: {
    Loading
  },
  data: () => ({
    userID: "",
    accessKey: "",     
    loading: false
  }),

  methods: {
    async submit() {
      try {
        this.loading = true;
        const { data } = await api.post('/Accounts', { userID: this.userID, accessKey: this.accessKey, grantType: "password" });             
        if(data.accessToken){
          window.localStorage.setItem('accessToken', data.accessToken);
          window.localStorage.setItem('expiresIn', data.expiresIn);
          window.localStorage.setItem('name', data.name);
          document.location.href = document.location.origin;
        }       
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    }
  },
  computed: {
    disabledButton(){
      return this.userID === "" || this.accessKey === "";
    }
  },  
  created() {
    document.title = "Login";
    if(window.localStorage.accessToken){
      document.location.href = document.location.origin;
    }
  }
};
</script>

<style scoped>
.login {
  background: linear-gradient(to right, #1E5084 40%, #E8E8E8 40%);
  width: 100vw;
  height: 100vh;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
}

.form {
  display: grid;
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.form h1 {
  color: #E8E8E8;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}

.form label {
  margin-bottom: 10px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 500;
  color: #E8E8E8;
}
.form input {
  background: #E8E8E8;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  transition: all 0.3s;
}
.form input:focus,
.form input:hover {
  outline: none;
  transform: scale(1.1);
}
.form button {
  font-family: 'Open Sans', sans-serif;
  padding: 10px;
  margin-top: 10px;
  font-size: 1.125rem;
  font-weight: 700;
  background: #F2A50C;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  color: #000000;
  transition: all 0.3s;
  position: relative;
}
.form button:hover {
  background: #FFBB00;
}
.form button::after {
  content: url("../assets/Seta.svg");
  position: absolute;
  right: 45px;
}
.form button:hover::after {
  animation: move 1.2s infinite forwards;
}

@keyframes move {
  0% {
    margin-right: 10px;
  }

  100% {
    margin-right: 0px;
  }
}
.container img {
  width: 300px;
  height: 300px;
  max-width: 600px;
  margin: 0 auto;
}
</style>