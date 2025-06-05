<template>
  <div class="calendario-container">
    <Navbar />

    <div class="conteudo">
      <h1 class="titulo">Calendário de Guardas</h1>

      <div class="filtros">
        <label>
          Data Início:
          <input v-model="dataInicio" type="date" class="campo" />
        </label>

        <label>
          Data Fim:
          <input v-model="dataFim" type="date" class="campo" />
        </label>

        <label>
          Ordem:
          <select v-model="ordem" class="campo">
            <option value="crescente">Crescente</option>
            <option value="decrescente">Decrescente</option>
          </select>
        </label>

        <button @click="sortearGuardas" class="btn verde" :disabled="loading">
          Sortear Guardas
        </button>
        <button @click="apagarGuardas" class="btn vermelho" :disabled="loading">
          Apagar Guardas
        </button>
      </div>

      <div class="calendario-wrapper">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '~/pages/navbar.vue'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'


const dataInicio = ref('')
const dataFim = ref('')
const ordem = ref('crescente')
const loading = ref(false)
const events = ref([])

const renderEventContent = (arg) => {
  const isFeriado = arg.event.title?.toLowerCase().includes("feriado")
  const titleCompleto = arg.event.title || ''
  const linhas = titleCompleto.split("\n") || []

  const eventoHtml = isFeriado
    ? `<div>${titleCompleto.length > 25 ? titleCompleto.slice(0, 25) + "..." : titleCompleto}</div>`
    : linhas.map((l) => `<div>${l}</div>`).join("")

  return {
    domNodes: [
      Object.assign(document.createElement("div"), {
        className: "rounded text-xs leading-tight",
        style: `
          background-color: ${arg.event.backgroundColor || "#1a3e2a"};
          color: ${arg.event.textColor || "#ffffff"};
          padding: 2px 6px;
          font-size: 0.75rem;
          border-radius: 4px;
          ${isFeriado
            ? `
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `
            : `
            white-space: pre-wrap;
            word-break: break-word;
          `}
        `,
        innerHTML: eventoHtml,
        title: titleCompleto
      }),
    ],
  }
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: ptBrLocale, // <<< AQUI
  events: events.value,
  eventContent: renderEventContent,
  eventClick(info) {
    alert(`Guarda em ${info.event.start.toLocaleDateString()}\n\n${info.event.title}`)
  }
})

const fetchEvents = async () => {
  loading.value = true
  try {
    const [guardasRes, feriadosRes] = await Promise.all([
      axios.get('http://localhost:8000/guardas-agrupadas/'),
      axios.get('http://localhost:8000/feriados/')
    ])

    const guardas = guardasRes.data
    const feriados = feriadosRes.data

    const eventosGuardas = guardas.map(g => ({
      title: `Atiradores:\n ${
  [g.atirador_1, g.atirador_2, g.atirador_3]
    .map(a => a ? `#${a}` : '#VAGO')
    .join('\n')
}\nComandante: ${g.comandante ? `#${g.comandante}` : '#VAGO'}`,
      start: g["data-ref"].split('/').reverse().join('-'),
      color: '#1a3e2a'
    }))

    const eventosFeriados = feriados.map(f => ({
      title: `Feriado: ${f.nome}`,
      start: f.data,
      color: '#f9d54c',
      textColor: "#1a1a1a"
    }))

    events.value = [...eventosGuardas, ...eventosFeriados]
    calendarOptions.value.events = events.value
  } catch (error) {
    console.error('Erro ao carregar eventos:', error)
    alert('Erro ao carregar eventos ou feriados.')
  } finally {
    loading.value = false
  }
}

const sortearGuardas = async () => {
  if (!dataInicio.value || !dataFim.value) {
    alert('Informe a data de início e fim!')
    return
  }

  loading.value = true
  try {
    await axios.post('http://127.0.0.1:8000/sortear_guardas/', {
      data_inicio: dataInicio.value,
      data_fim: dataFim.value,
      ordem: ordem.value
    })

    alert('Sorteio realizado com sucesso!')
    await fetchEvents()
    dataInicio.value = ''
    dataFim.value = ''
  } catch (error) {
    console.error('Erro ao sortear guardas:', error)
    alert('Erro ao sortear guardas.')
  } finally {
    loading.value = false
  }
}

const apagarGuardas = async () => {
  if (!confirm('Tem certeza que deseja apagar todas as guardas?')) return

  loading.value = true
  try {
    await axios.delete('http://127.0.0.1:8000/apagar_guardas/')
    alert('Guardas apagadas com sucesso!')
    await fetchEvents()
  } catch (error) {
    console.error('Erro ao apagar guardas:', error)
    alert('Erro ao apagar guardas.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchEvents)
</script>

<style scoped>
.calendario-container {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
}

.conteudo {
  background: white;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.titulo {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.campo {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  min-width: 150px;
}

.btn {
  padding: 10px 16px;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.verde {
  background-color: #1a3e2a;
  color: white;
}

.vermelho {
  background-color: #c0392b;
  color: white;
}

.calendario-wrapper {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.evento-customizado {
  background-color: #dff4e6;
  color: #1a3e2a;
  padding: 6px;
  border-radius: 5px;
  font-size: 0.75rem;
  line-height: 1.1;
}
</style>
