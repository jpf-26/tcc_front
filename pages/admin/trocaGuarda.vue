<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '~/pages/navbar.vue'
import axios from 'axios'

const trocasPendentes = ref([])
const loading = ref(true)
const erro = ref(null)

const substituto = ref('')
const dataSolicitante = ref('')
const dataSubstituto = ref('')
const motivo = ref('')
const mensagem = ref('')
const mensagemErro = ref(false)

const fetchTrocas = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const user = JSON.parse(localStorage.getItem('user'))
    if (!accessToken || !user) {
      erro.value = 'Usuário não autenticado.'
      return
    }

    const headers = { Authorization: `Bearer ${accessToken}` }

    const response = await axios.get('http://127.0.0.1:8000/trocas_detalhadas/', { headers })

    trocasPendentes.value = response.data.filter(
      troca => troca.solicitante === user.nome_guerra || troca.substituto === user.nome_guerra
    )
  } catch (err) {
    erro.value = 'Erro ao buscar trocas: ' + err.message
  } finally {
    loading.value = false
  }
}

const enviarSolicitacao = async () => {
  loading.value = true
  mensagem.value = ''
  mensagemErro.value = false
  try {
    const token = localStorage.getItem('accessToken')
    await axios.post(
      'http://127.0.0.1:8000/solicitar-troca/',
      {
        substituto: substituto.value,
        data_solicitante: dataSolicitante.value,
        data_substituto: dataSubstituto.value,
        motivo: motivo.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    mensagem.value = 'Solicitação enviada com sucesso!'
    mensagemErro.value = false
    substituto.value = ''
    dataSolicitante.value = ''
    dataSubstituto.value = ''
    motivo.value = ''
    await fetchTrocas()
  } catch (error) {
    mensagem.value = error.response?.data?.erro || 'Erro ao enviar solicitação.'
    mensagemErro.value = true
  } finally {
    loading.value = false
  }
}

const aceitarTroca = async (id_troca) => {
  try {
    const token = localStorage.getItem('accessToken')

    await axios.post('http://127.0.0.1:8000/aceitar-troca/', { id_troca }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    await axios.put('http://127.0.0.1:8000/executar-troca/', { id_troca }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    await fetchTrocas()
  } catch (err) {
    alert('Erro ao aceitar ou executar troca: ' + (err.response?.data?.erro || err.message))
  }
}

const recusarTroca = async (id_troca) => {
  try {
    const token = localStorage.getItem('accessToken')
    await axios.post('http://127.0.0.1:8000/rejeitar-troca/', { id_troca }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchTrocas()
  } catch (err) {
    alert('Erro ao recusar troca: ' + (err.response?.data?.erro || err.message))
  }
}

onMounted(fetchTrocas)
</script>

<template>
  <div>
    <Navbar />
    <div class="p-4 flex flex-col items-center gap-8">
      <!-- Solicitação de Troca -->
      <div class="bg-gray-100 p-6 rounded shadow w-full max-w-xl">
        <h2 class="text-lg font-semibold mb-4">Solicitar Troca de Guarda</h2>
        <form @submit.prevent="enviarSolicitacao" class="flex flex-col gap-4">
          <div>
            <label>Nome de Guerra do Substituto:</label>
            <input v-model="substituto" class="border px-3 py-1 rounded w-full" required />
          </div>
          <div>
            <label>Data da Guarda do Solicitante:</label>
            <input v-model="dataSolicitante" type="date" class="border px-3 py-1 rounded w-full" required />
          </div>
          <div>
            <label>Data da Guarda do Substituto:</label>
            <input v-model="dataSubstituto" type="date" class="border px-3 py-1 rounded w-full" required />
          </div>
          <div>
            <label>Motivo:</label>
            <textarea v-model="motivo" class="border px-3 py-1 rounded w-full" />
          </div>
          <button type="submit" :disabled="loading" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Enviar Solicitação
          </button>
        </form>
        <p v-if="mensagem" :class="['mt-4 font-semibold', mensagemErro ? 'text-red-600' : 'text-green-600']">
          {{ mensagem }}
        </p>
      </div>

      <!-- Trocas Pendentes -->
      <div class="w-full max-w-3xl">
        <h1 class="text-xl font-bold mb-4">Trocas Pendentes</h1>
        <div v-if="loading">Carregando trocas...</div>
        <div v-else-if="erro" class="text-red-500">{{ erro }}</div>
        <div v-else>
          <div v-if="trocasPendentes.length === 0">Nenhuma troca pendente para você.</div>
          <ul v-else class="space-y-4">
            <li v-for="troca in trocasPendentes" :key="troca.id_troca" class="p-4 border rounded shadow">
              <p><strong>Motivo:</strong> {{ troca.motivo }}</p>
              <p><strong>Solicitante:</strong> {{ troca.solicitante }}</p>
              <p><strong>Substituto:</strong> {{ troca.substituto }}</p>
              <p><strong>Data da guarda do solicitante:</strong> {{ new Date(troca.data_guarda_solicitante).toLocaleDateString('pt-BR') }}</p>
              <p><strong>Data da guarda do substituto:</strong> {{ new Date(troca.data_guarda_substituto).toLocaleDateString('pt-BR') }}</p>
              <div class="mt-2">
                <button @click="aceitarTroca(troca.id_troca)" class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Aceitar</button>
                <button @click="recusarTroca(troca.id_troca)" class="ml-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Recusar</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s;
}
</style>
