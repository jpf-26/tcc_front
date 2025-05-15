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
  const linhas = arg.event.title?.split("\n") || [];
  return {
    domNodes: [
      Object.assign(document.createElement("div"), {
        className: "rounded p-1 text-xs leading-tight whitespace-pre-wrap",
        style: `background-color: ${arg.event.backgroundColor || "#007bff"}; color: ${arg.event.textColor || "white"};`,
        innerHTML: linhas.map((l) => `<div>${l}</div>`).join(""),
      }),
    ],
  };
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  events: events.value,
  eventContent: renderEventContent,
  eventClick(info) {
    alert(`${info.event.title}\n${info.event.start.toLocaleDateString()}`);
  },
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
      color: "#007bff",
    }));

    const eventosFeriados = feriados.map((f) => ({
      title: `Feriado: ${f.nome}`,
      start: f.data,
      backgroundColor: "#f87171",
      textColor: "#000000",
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

<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>

  <div class="w-full max-w-6xl mb-8">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
