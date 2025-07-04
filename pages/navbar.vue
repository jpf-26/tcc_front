<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import brasao from '@/assets/brasao_tg.png'

const router = useRouter()
const route = useRoute()
const notificacoes = ref([])
const temNotificacao = ref(false)
const isAdmin = ref(false)
const showLogoutOverlay = ref(false)

const logout = () => {
  showLogoutOverlay.value = true
  setTimeout(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    router.push('/')
  }, 2000)
}

const carregarNotificacoes = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const user = JSON.parse(localStorage.getItem('user'))

    if (!token || !user) return

    isAdmin.value = user?.role === 'admin'

    const response = await axios.get('http://127.0.0.1:8000/Notificacao/', {
      headers: { Authorization: `Bearer ${token}` }
    })

    notificacoes.value = response.data.results.filter(
      n => (n.numero_atirador === user.numero_atirador || n.numero_atirador?.id === user.numero_atirador)
        && n.status === 'Pendente'
    )

    temNotificacao.value = notificacoes.value.length > 0
  } catch (err) {
    console.error('Erro ao buscar notificações:', err)
  }
}

const irParaNotificacoes = () => {
  if (route.fullPath.includes('/admin')) {
    router.push('/admin/notificacao')
  } else {
    router.push('/users/notificacao')
  }
}

onMounted(carregarNotificacoes)
</script>


<template>
  <nav>
    <img :src="brasao" alt="Brasão TG" class="logo-tg" />
    <div class="links">
      <NuxtLink v-if="!isAdmin" class="nav-link" to="/users/">Home</NuxtLink>
      <NuxtLink v-else class="nav-link" to="/admin/">Home</NuxtLink>
      <NuxtLink v-if="!isAdmin" class="nav-link" to="/users/trocaGuarda">Troca de Guarda</NuxtLink>
      <NuxtLink v-else class="nav-link" to="/admin/CadastroUsuario">Usuário</NuxtLink>
      <NuxtLink class="nav-link" to="calendar">Calendário</NuxtLink>

      <button class="nav-link" @click="irParaNotificacoes">
        Notificações
        <span v-if="temNotificacao" class="dot"></span>
      </button>
      <NuxtLink class="nav-link" to="Perfil">Perfil</NuxtLink>
      <button class="nav-link" @click="logout">Logout</button>
    </div>
  </nav>

  <!-- Overlay de encerrando o sistema -->
  <div v-if="showLogoutOverlay" class="logout-overlay">
    <div class="logout-box">
      <p>Saindo do sistema...</p>
      <div class="loader"></div>
    </div>
  </div>
</template>


<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a3e2a;
  padding: 12px 30px;
  border-bottom: 4px solid #c9a12f;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.logo-tg {
  height: 42px;
  width: auto;
}

.links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #f9d54c;
}

.dot {
  width: 9px;
  height: 9px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  right: 4px;
}

.logout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 62, 42, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.logout-box {
  text-align: center;
  color: #f9d54c;
  font-size: 20px;
  font-weight: bold;
}

.loader {
  margin: 20px auto 0;
  border: 4px solid #fff;
  border-top: 4px solid #f9d54c;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

