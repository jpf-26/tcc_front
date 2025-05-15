<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '~/pages/navbar.vue'

const dataInicio = ref('')
const dataFim = ref('')
const ordem = ref('crescente')
const loading = ref(false)
const events = ref([])

const renderEventContent = (arg) => {
  const linhas = arg.event.title?.split('\n') || []
  return {
    domNodes: [
      Object.assign(document.createElement('div'), {
        className: 'bg-red-300 text-black rounded p-1 text-xs leading-tight',
        innerHTML: linhas.map(l => `<div>${l}</div>`).join('')
      })
    ]
  }
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
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
      title: `Atiradores:\n #${g.atirador_1}\n #${g.atirador_2}\n #${g.atirador_3}\nComandante: #${g.comandante}`,
      start: g["data-ref"].split('/').reverse().join('-'),
      color: '#007bff'
    }))

    const eventosFeriados = feriados.map(f => ({
      title: `Feriado: ${f.nome}`,
      start: f.data,
      color: '#FF6666'
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

<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>

  <div class="flex flex-col items-center justify-center p-6">
    <div class="mb-4 flex flex-col sm:flex-row items-center gap-4">
      <label class="flex flex-col text-sm">
        Data Início:
        <input v-model="dataInicio" type="date" class="border px-3 py-1 rounded" />
      </label>

      <label class="flex flex-col text-sm">
        Data Fim:
        <input v-model="dataFim" type="date" class="border px-3 py-1 rounded" />
      </label>

      <label class="flex flex-col text-sm">
        Ordem:
        <select v-model="ordem" class="border px-3 py-1 rounded">
          <option value="crescente">Crescente</option>
          <option value="decrescente">Decrescente</option>
        </select>
      </label>
    </div>

    <div class="mb-6 flex gap-4">
      <button
        @click="sortearGuardas"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow"
        :disabled="loading"
      >
        Sortear Guardas
      </button>

      <button
        @click="apagarGuardas"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
        :disabled="loading"
      >
        Apagar Guardas
      </button>
    </div>

    <div class="w-full max-w-6xl mb-8">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
