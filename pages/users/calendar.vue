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
    <div v-if="popupVisible" class="modal-overlay">
      <div class="modal">
        <p><strong>{{ popupData }}</strong></p>
        <div v-html="popupContent" style="text-align:left; margin-top: 10px;"></div>
        <div class="modal-botoes">
          <button class="btn-fechar" @click="popupVisible = false">Fechar</button>
        </div>
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
const popupVisible = ref(false);
const popupContent = ref("");
const popupData = ref(""); 

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
            ? `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
            : `white-space: pre-wrap; word-break: break-word;`
          }
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
    popupData.value = `Guarda em ${info.event.start.toLocaleDateString("pt-BR")}`; // 🔹 NOVO
    popupContent.value = info.event.title.replaceAll('\n', '<br>');
    popupVisible.value = true;
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

    const eventosGuardas = guardas.map((g) => {
      const atiradores = [g.atirador_1, g.atirador_2, g.atirador_3].map(a => a ? `- ${a}` : '- VAGO').join('\n')
      const comandante = g.comandante ? g.comandante : 'VAGO'

      return {
        title: `Atiradores:\n${atiradores}\nComandante: ${comandante}`,
        start: g["data-ref"].split("/").reverse().join("-"),
        backgroundColor: "#1a3e2a",
        textColor: "#ffffff",
      }
    });

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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px 20px;
  border-radius: 14px;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #1a3e2a;
}

.modal-titulo {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #1a3e2a;
}

.modal-botoes {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-fechar {
  padding: 8px 20px;
  background-color: #1a3e2a;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-fechar:hover {
  background-color: #14532d;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  text-align: center;
}

.modal-botoes {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-fechar {
  padding: 10px 16px;
  background-color: #1a3e2a;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-fechar:hover {
  background-color: #14532d;
}
</style>