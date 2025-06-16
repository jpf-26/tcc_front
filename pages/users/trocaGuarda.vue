<template>
  <div class="tela-troca">
    <Navbar />
    <div class="conteudo">
      <div class="bloco">
        <h2 class="titulo-secao">Solicitar Troca de Guarda</h2>
        <form @submit.prevent="enviarSolicitacao" class="formulario">
          <label>
            Nome de Guerra do Substituto:
            <input v-model="substituto" class="input" required />
          </label>
          <label>
            Data da Sua Guarda:
            <input v-model="dataSolicitante" type="date" class="input" required />
          </label>
          <label>
            Data da Guarda do Substituto:
            <input v-model="dataSubstituto" type="date" class="input" required />
          </label>
          <label>
            Motivo:
            <textarea v-model="motivo" class="input" rows="2" />
          </label>
          <button type="submit" :disabled="loading" class="btn-verde">
            Enviar Solicitação
          </button>
          <p v-if="mensagem" :class="['mensagem', mensagemErro ? 'erro' : 'sucesso']">
            {{ mensagem }}
          </p>
        </form>
      </div>
      <div class="bloco">
        <h2 class="titulo-secao">Trocas Pendentes</h2>
        <div v-if="loading">Carregando trocas...</div>
        <div v-else-if="erro" class="erro">{{ erro }}</div>
        <div v-else>
          <div v-if="trocasPendentes.length === 0" class="text-gray-600">
            Nenhuma troca pendente para você.
          </div>
          <ul v-else class="lista-trocas">
            <li
              v-for="troca in trocasPendentes"
              :key="troca.id_troca"
              class="item-troca"
            >
              <p><strong>Motivo:</strong> {{ troca.motivo }}</p>
              <p><strong>Solicitante:</strong> {{ troca.solicitante }}</p>
              <p><strong>Substituto:</strong> {{ troca.substituto }}</p>
              <p><strong>Data do solicitante:</strong> {{ new Date(troca.data_guarda_solicitante).toLocaleDateString('pt-BR') }}</p>
              <p><strong>Data do substituto:</strong> {{ new Date(troca.data_guarda_substituto).toLocaleDateString('pt-BR') }}</p>
              <div v-if="usuarioLogado?.nome_guerra === troca.substituto" class="acoes">
                <button @click="aceitarTroca(troca.id_troca)" class="btn-verde">Aceitar</button>
                <button @click="recusarTroca(troca.id_troca)" class="btn-vermelho">Recusar</button>
              </div>
              <div v-else-if="usuarioLogado?.nome_guerra === troca.solicitante" class="aguardando">
                Aguardando resposta do substituto.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

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

const usuarioLogado = ref(null)

const fetchTrocas = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    usuarioLogado.value = JSON.parse(localStorage.getItem('user'))
    if (!accessToken || !usuarioLogado.value) {
      erro.value = 'Usuário não autenticado.'
      return
    }

    const headers = { Authorization: `Bearer ${accessToken}` }
    const response = await axios.get('http://127.0.0.1:8000/trocas_detalhadas/', { headers })

    trocasPendentes.value = response.data.filter(
      troca =>
        troca.solicitante === usuarioLogado.value.nome_guerra ||
        troca.substituto === usuarioLogado.value.nome_guerra
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
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    mensagem.value = '📨 Solicitação enviada com sucesso!'
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
  mensagem.value = ''
  mensagemErro.value = false
  try {
    const token = localStorage.getItem('accessToken')

    await axios.post(
      'http://127.0.0.1:8000/aceitar-troca/',
      { id_troca },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    await axios.put(
      'http://127.0.0.1:8000/executar-troca/',
      { id_troca },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    mensagem.value = '✅ Troca de guarda aceita e executada com sucesso.'
    mensagemErro.value = false
    await fetchTrocas()
  } catch (err) {
    mensagem.value = err.response?.data?.erro || 'Erro ao aceitar ou executar troca.'
    mensagemErro.value = true
  }
}

const recusarTroca = async (id_troca) => {
  mensagem.value = ''
  mensagemErro.value = false
  try {
    const token = localStorage.getItem('accessToken')
    await axios.post(
      'http://127.0.0.1:8000/rejeitar-troca/',
      { id_troca },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    mensagem.value = '❌ Troca recusada com sucesso.'
    mensagemErro.value = false
    await fetchTrocas()
  } catch (err) {
    mensagem.value = err.response?.data?.erro || 'Erro ao recusar troca.'
    mensagemErro.value = true
  }
}

onMounted(fetchTrocas)
</script>

<style scoped>
.tela-troca {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
}

.conteudo {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.bloco {
  margin-bottom: 40px;
}

.titulo-secao {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1a3e2a;
  text-align: center;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
}

.mensagem {
  margin-top: 10px;
  font-weight: 600;
}

.sucesso {
  color: #2d7a46;
}

.erro {
  color: #c0392b;
}

.lista-trocas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-troca {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #f9fafb;
}

.acoes {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.aguardando {
  margin-top: 10px;
  color: #666;
  font-style: italic;
}

.btn-verde {
  background-color: #1a3e2a;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-verde:hover {
  background-color: #14532d;
}

.btn-vermelho {
  background-color: #c0392b;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-vermelho:hover {
  background-color: #992d22;
}
</style>
