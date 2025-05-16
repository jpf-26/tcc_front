<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const notificacoes = ref([])
const temNotificacao = ref(false)
const isAdmin = ref(false)

const goBack = () => {
  router.back()
}

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  router.push('/')
}

const carregarNotificacoes = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const user = JSON.parse(localStorage.getItem('user'))

    if (!token || !user) return

    // Verifica se é admin
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
    <div class="links">
      <!-- Botão condicional -->
      <NuxtLink v-if="!isAdmin" class="nav-link" to="trocaGuarda">Troca de Guarda</NuxtLink>
      <NuxtLink v-else class="nav-link" to="/admin/CadastroUsuario">Usuário</NuxtLink>

      <button class="nav-link" @click="goBack">Voltar</button>
      <NuxtLink class="nav-link" to="calendar">Calendário</NuxtLink>
      <button class="nav-link" @click="irParaNotificacoes">
        Notificações
        <span v-if="temNotificacao" class="dot"></span>
      </button>
      <button class="nav-link" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #dce6e9;
  padding: 10px 20px;
  border-bottom: 2px solid #ccc;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-left: auto;
}

.nav-link {
  text-decoration: none;
  color: #28a745;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  position: relative;
}

.nav-link:hover {
  text-decoration: underline;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  right: -5px;
}
</style>
