<template>
  <div class="tela-notificacoes">
    <Navbar />
    <NuxtPage />
    <div class="container">
      <h1 class="titulo">Notificações</h1>
      <div v-if="loading" class="text-center">Carregando...</div>
      <div v-else-if="erro" class="text-red-600 text-center">{{ erro }}</div>
      <div v-else>
        <div v-if="notificacoes.length === 0" class="text-center">
          Você não possui notificações.
        </div>
        <ul class="notificacoes-lista">
          <li
            v-for="n in notificacoes"
            :key="n.id"
            class="notificacao-item"
          >
            <div class="icone">🔔</div>
            <div class="conteudo">
              <p class="mensagem">{{ n.mensagem }}</p>
              <p class="data">Enviado em {{ new Date(n.data_envio).toLocaleDateString('pt-BR') }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

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

<style scoped>
.tela-notificacoes {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
}

.container {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.titulo {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #1a3e2a;
  text-align: center;
}

.notificacoes-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notificacao-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.icone {
  font-size: 1.4rem;
  color: #facc15; 
  margin-top: 2px;
}

.conteudo {
  display: flex;
  flex-direction: column;
}

.mensagem {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a3e2a;
}

.data {
  font-size: 0.9rem; 
  color: #6b7280;
  margin-top: 4px;
}
</style>
