<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import brasao from '@/assets/brasao_tg.png';


const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const login = () => {
  authStore.login(email.value, password.value, router);
};
</script>

<template>
  <div class="login-background">
    <div class="login-box">
      <img :src="brasao" alt="Brasão TG" class="brasao" />
      <h2>TG 02-020</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="E-mail" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
        <p v-if="authStore.errorMessage" class="error">{{ authStore.errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-background {
  height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-box {
  background-color: #fdf6e3;
  border: 3px solid #c9a12f;
  border-radius: 12px;
  padding: 35px 30px;
  width: 360px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  font-family: 'Segoe UI', sans-serif;
}

.brasao {
  width: 90px;
  margin-bottom: 10px;
}

h2 {
  color: #1a3e2a;
  font-weight: 700;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  width: 90%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

button {
  width: 90%;
  padding: 12px;
  background-color: #1a3e2a;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #14301f;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  background: none;
}
</style>
