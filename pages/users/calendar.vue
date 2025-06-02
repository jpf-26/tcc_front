<template>
  <div class="tela-calendario">
    <Navbar />
    <NuxtPage />

    <div class="conteudo">
      <h1 class="titulo">Calendário de Guardas e Feriados</h1>
      <div class="calendario-wrapper">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "~/pages/navbar.vue";

const loading = ref(false);
const events = ref([]);

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
  initialView: "dayGridMonth",
  events: events.value,
  eventContent: renderEventContent,
  eventClick(info) {
    alert(`${info.event.title}\n${info.event.start.toLocaleDateString("pt-BR")}`);
  },
  locale: "pt-br"
});

const fetchEvents = async () => {
  loading.value = true;
  try {
    const [guardasRes, feriadosRes] = await Promise.all([
      axios.get("http://localhost:8000/guardas-agrupadas/"),
      axios.get("http://localhost:8000/feriados/"),
    ]);

    const guardas = guardasRes.data;
    const feriados = feriadosRes.data;

    const eventosGuardas = guardas.map((g) => ({
      title: `Atiradores:\n #${g.atirador_1}\n #${g.atirador_2}\n #${g.atirador_3}\nComandante: #${g.comandante}`,
      start: g["data-ref"].split("/").reverse().join("-"),
      backgroundColor: "#1a3e2a",
      textColor: "#ffffff",
    }));

    const eventosFeriados = feriados.map((f) => ({
      title: `Feriado: ${f.nome}`,
      start: f.data,
      backgroundColor: "#facc15",
      textColor: "#1a1a1a",
    }));

    events.value = [...eventosGuardas, ...eventosFeriados];
    calendarOptions.value.events = events.value;
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    alert("Erro ao carregar os eventos.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEvents);
</script>

<style scoped>
.tela-calendario {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
}

.conteudo {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.titulo {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1a3e2a;
}

.calendario-wrapper {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}
</style>
