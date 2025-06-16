<template>
  <div class="tela-perfil">
    <Navbar />
    <NuxtPage />
    <div class="container">
      <h1 class="titulo">Meu Perfil</h1>
      <div v-if="loading" class="text-center">Carregando...</div>
      <div v-else-if="erro" class="text-red-600 text-center">{{ erro }}</div>
      <div v-else class="perfil-completo">
        <div class="cabecalho">
          <img :src="usuario.foto || '/default.jpg'" class="foto" alt="Foto de perfil" />
          <div class="infos">
            <h2 class="nome">{{ usuario.nome_completo }}</h2>
            <p class="patente">{{ usuario.patente }}</p>
          </div>
        </div>
        <section>
          <h3 class="subtitulo">Informações Pessoais</h3>
          <div class="tabela">
            <div><span>Nome de guerra:</span><span>{{ usuario.nome_guerra }}</span></div>
            <div><span>Email:</span><span>{{ usuario.email }}</span></div>
            <div><span>Telefone:</span><span>{{ usuario.telefone || 'Não informado' }}</span></div>
            <div><span>CPF:</span><span>{{ usuario.cpf }}</span></div>
            <div><span>Sexo:</span><span>{{ usuario.sexo }}</span></div>
            <div><span>Data de nascimento:</span><span>{{ usuario.data_nascimento }}</span></div>
            <div><span>Pai:</span><span>{{ usuario.pai }}</span></div>
            <div><span>Mãe:</span><span>{{ usuario.mae }}</span></div>
            <div><span>Trabalho:</span><span>{{ usuario.trabalho }}</span></div>
            <div><span>Escolaridade:</span><span>{{ usuario.escolaridade }}</span></div>
            <div><span>Rua:</span><span>{{ usuario.rua }}</span></div>
            <div><span>Nº:</span><span>{{ usuario.numero_casa }}</span></div>
            <div><span>Bairro:</span><span>{{ usuario.bairro }}</span></div>
            <div><span>Cidade:</span><span>{{ usuario.cidade }}</span></div>
            <div><span>Complemento:</span><span>{{ usuario.complemento }}</span></div>
            <div><span>CEP:</span><span>{{ usuario.cep }}</span></div>
          </div>
        </section>
        <section>
          <h3 class="subtitulo">Informações Militares</h3>
          <div class="tabela">
            <div><span>Nº do atirador:</span><span>{{ usuario.numero_atirador }}</span></div>
            <div><span>Comandante:</span><span>{{ usuario.comandante === 'S' ? 'Sim' : 'Não' }}</span></div>
            <div><span>RA:</span><span>{{ usuario.ra }}</span></div>
            <div><span>Tipo sanguíneo:</span><span>{{ usuario.tipo_sanguineo }}</span></div>
            <div><span>Patente:</span><span>{{ usuario.patente }}</span></div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '~/pages/navbar.vue'

const usuario = ref({})
const loading = ref(true)
const erro = ref(null)

const fetchUsuario = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const userStorage = localStorage.getItem('user')
    if (!token || !userStorage) {
      erro.value = 'Usuário não autenticado.'
      return
    }

    const user = JSON.parse(userStorage)

    const response = await axios.get(`http://127.0.0.1:8000/usuario/${user.id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    usuario.value = response.data
  } catch (err) {
    erro.value = 'Erro ao carregar informações do perfil.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsuario)
</script>

<style scoped>
.tela-perfil {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
}

.container {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  max-width: 1000px;
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

.perfil-completo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.foto {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #1a3e2a44;
}

.nome {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #1a3e2a;
}

.patente {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  background-color: #f9d54c;
  padding: 4px 12px;
  border-radius: 999px;
  display: inline-block;
  margin-top: 4px;
}

.subtitulo {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1a3e2a;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
  margin-bottom: 10px;
}

.tabela {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tabela div {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 4px 0;
}

.tabela div span:first-child {
  font-weight: 500;
  color: #374151;
}

.tabela div span:last-child {
  color: #1a3e2a;
  font-weight: 500;
}
</style>
