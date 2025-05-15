<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '~/pages/navbar.vue'

const notificacoes = ref([])
const loading = ref(true)
const erro = ref(null)

const marcarTodasComoLidas = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    await axios.post('http://127.0.0.1:8000/notificacoes/marcar_todas_lidas/', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (err) {
    console.error('Erro ao marcar notificações como lidas:', err)
  }
}

const fetchNotificacoes = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const user = JSON.parse(localStorage.getItem('user'))

    if (!token || !user) {
      erro.value = 'Usuário não autenticado.'
      return
    }

    const response = await axios.get('http://127.0.0.1:8000/Notificacao/', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const recebidas = response.data.results.filter(
      n => n.numero_atirador === user.numero_atirador
    )

    notificacoes.value = recebidas
      .sort((a, b) => new Date(b.data_envio) - new Date(a.data_envio))
      .map(n => ({
        ...n,
        mensagem: n.mensagem || 'Você possui uma nova solicitação de troca de guarda. Confira sua agenda.'
      }))
  } catch (err) {
    erro.value = 'Erro ao buscar notificações.'
  } finally {
    loading.value = false
  }
}

const waitForUser = () => {
  return new Promise((resolve) => {
    const check = () => {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('accessToken')
      if (user && token) return resolve()
      setTimeout(check, 100)
    }
    check()
  })
}

onMounted(async () => {
  await waitForUser()
  await fetchNotificacoes()
  await marcarTodasComoLidas()
})
</script>

<template>
  <div class="p-6">
    <div>
      <Navbar />
      <NuxtPage />
    </div>
    <h1 class="text-xl font-bold mb-4">Notificações</h1>
    <div v-if="loading">Carregando...</div>
    <div v-else-if="erro" class="text-red-600">{{ erro }}</div>
    <div v-else>
      <div v-if="notificacoes.length === 0">Você não possui notificações.</div>
      <ul class="space-y-4">
        <li v-for="n in notificacoes" :key="n.id" class="p-4 bg-white rounded shadow flex items-center gap-4">
          <div class="bg-yellow-400 text-white w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold">!</div>
          <div>
            <p class="text-sm font-medium">{{ n.mensagem }}</p>
            <p class="text-xs text-gray-500">Enviado em {{ new Date(n.data_envio).toLocaleDateString('pt-BR') }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.text-yellow-600 {
  font-size: 1.5rem;
}
</style>
