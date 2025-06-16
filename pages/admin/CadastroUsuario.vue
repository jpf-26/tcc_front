<script setup>
import Navbar from "~/pages/navbar.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { nextTick } from 'vue'


const API_URL_LISTAR = "http://localhost:8000/usuario/";
const API_URL_CADASTRAR = "http://127.0.0.1:8000/cadastrar_usuario/";

const usuarios = ref([]);
const termoBusca = ref("");
const editandoId = ref(null);

// Notificação amigável
const mensagem = ref("");
const tipoMensagem = ref(""); // 'sucesso' | 'erro'

function exibirMensagem(texto, tipo = "sucesso") {
  mensagem.value = texto;
  tipoMensagem.value = tipo;
  setTimeout(() => {
    mensagem.value = "";
    tipoMensagem.value = "";
  }, 4000);
}

const novoUsuario = ref({
  nome_completo: "",
  nome_guerra: "",
  numero_atirador: "",
  cpf: "",
  email: "",
  senha: "1",
  password: "",
  rua: "",
  bairro: "",
  cidade: "",
  numero_casa: "",
  cep: "",
  data_nascimento: "",
  sexo: "M",
  tipo_sanguineo: "",
  pai: "",
  mae: "",
  escolaridade: "",
  trabalho: "",
  complemento: "",
  patente: "A",
  comandante: "N",
  role: "user",
  foto: null,
  is_superuser: 0,
  is_staff: 0,
  is_active: 1,
  ra: "",
  senha: 1
});

async function carregarUsuarios() {
  try {
    const { data } = await axios.get(API_URL_LISTAR, {
      params: { search: termoBusca.value }
    });
    usuarios.value = data.results || data;
  } catch (error) {
    exibirMensagem("Erro ao carregar usuários.", "erro");
  }
}

async function cadastrarOuAtualizarUsuario() {
  try {
    const formData = new FormData();
    const usuarioCopia = { ...novoUsuario.value };

    delete usuarioCopia.groups;
    delete usuarioCopia.user_permissions;

    for (const key in usuarioCopia) {
      if (key === "foto") {
        if (usuarioCopia.foto instanceof File) {
          formData.append("foto", usuarioCopia.foto);
        }
      } else if (usuarioCopia[key] !== null && usuarioCopia[key] !== "") {
        formData.append(key, usuarioCopia[key]);
      }
    }

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    if (editandoId.value) {
      await axios.put(`${API_URL_LISTAR}${editandoId.value}/`, formData, config);
      exibirMensagem("Usuário atualizado com sucesso!", "sucesso");
    } else {
      await axios.post(API_URL_CADASTRAR, formData, config);
      exibirMensagem("Usuário cadastrado com sucesso!", "sucesso");
    }

    await carregarUsuarios();
    limparFormulario();
  } catch (error) {
    let mensagens = [];

if (error.response?.data && typeof error.response.data === "object") {
  for (const campo in error.response.data) {
    const erros = error.response.data[campo];
    if (Array.isArray(erros)) {
      erros.forEach(erro => {
        mensagens.push(`${formatarCampo(campo)}: ${erro}`);
      });
    }
  }
} else if (typeof error.response?.data === "string") {
  mensagens.push(error.response.data);
} else {
  mensagens.push(error.message);
}

exibirMensagem("Erro ao cadastrar/editar usuário:\n" + mensagens.join("\n"), "erro");


function formatarCampo(campo) {
  const traducoes = {
    nome_completo: "Nome Completo",
    nome_guerra: "Nome de Guerra",
    numero_atirador: "Número do Atirador",
    cpf: "CPF",
    email: "E-mail",
    password: "Senha",
    rua: "Rua",
    bairro: "Bairro",
    cidade: "Cidade",
    numero_casa: "Número da Casa",
    cep: "CEP",
    data_nascimento: "Data de Nascimento",
    foto: "Foto",
    ra: "RA"
    
  };
  return traducoes[campo] || campo;
}
  }
}

function editarUsuario(usuario) {
  editandoId.value = usuario.id;
  const usuarioEditavel = { ...usuario, password: "" };
  delete usuarioEditavel.groups;
  delete usuarioEditavel.user_permissions;
  novoUsuario.value = usuarioEditavel;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormulario() {
  editandoId.value = null;
  novoUsuario.value = {
    nome_completo: "",
    nome_guerra: "",
    numero_atirador: "",
    cpf: "",
    email: "",
    password: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero_casa: "",
    cep: "",
    data_nascimento: "",
    sexo: "M",
    tipo_sanguineo: "",
    pai: "",
    mae: "",
    escolaridade: "",
    trabalho: "",
    complemento: "",
    patente: "A",
    comandante: "N",
    role: "user",
    foto: null,
    is_superuser: 0,
    is_staff: 0,
    is_active: 1,
    ra: ""
  };
}

const usuarioASerDeletado = ref(null);
const mostrarConfirmacao = ref(false);

function confirmarExclusao(usuario) {
  usuarioASerDeletado.value = usuario;
  mostrarConfirmacao.value = true;
}

async function deletarUsuarioConfirmado() {
  try {
    await axios.delete(`http://localhost:8000/deletar_usuario/${usuarioASerDeletado.value.id}/`);
    await carregarUsuarios();
  } catch (error) {
    let erroMsg = "Erro ao deletar usuário.";
    if (error.response?.data) {
      erroMsg += typeof error.response.data === "string"
        ? ` ${error.response.data}`
        : ` ${JSON.stringify(error.response.data)}`;
    } else {
      erroMsg += " " + error.message;
    }
    exibirMensagem(erroMsg, "erro");
    return;
  } finally {
    mostrarConfirmacao.value = false;
    usuarioASerDeletado.value = null;
  }

  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 aqui sobe a tela
  exibirMensagem("Usuário apagado com sucesso!", "sucesso");
}





watch(termoBusca, () => {
  carregarUsuarios();
});

onMounted(carregarUsuarios);

function onFileChange(event) {
  novoUsuario.value.foto = event.target.files[0];
}
</script>



<template>
  <div class="tela-usuario">
    <Navbar />
    <div class="container">
    <div v-if="mensagem" :class="['mensagem', tipoMensagem]">
       {{ mensagem }}
    </div>
      <h1 class="titulo">Cadastro de Usuário</h1>
      <div class="formulario">
        <h2 v-if="editandoId" class="editando">Editando: {{ novoUsuario.nome_completo }}</h2>
        <div class="grid">
          <input v-model="novoUsuario.nome_completo" placeholder="Nome Completo" class="input" />
          <input v-model="novoUsuario.nome_guerra" placeholder="Nome de Guerra" class="input" />
          <input v-model="novoUsuario.numero_atirador" placeholder="Número Atirador" class="input" />
          <input v-model="novoUsuario.cpf" placeholder="CPF" class="input" />
          <input v-model="novoUsuario.ra" placeholder="RA" class="input" />
          <input v-model="novoUsuario.email" placeholder="Email" class="input" />
          <input v-model="novoUsuario.password" type="password" placeholder="Senha" class="input" />
          <input v-model="novoUsuario.data_nascimento" type="date" class="input" />
          <select v-model="novoUsuario.sexo" class="input">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
          <input v-model="novoUsuario.tipo_sanguineo" placeholder="Tipo Sanguíneo" class="input" />
          <input v-model="novoUsuario.pai" placeholder="Pai" class="input" />
          <input v-model="novoUsuario.mae" placeholder="Mãe" class="input" />
          <input v-model="novoUsuario.escolaridade" placeholder="Escolaridade" class="input" />
          <input v-model="novoUsuario.trabalho" placeholder="Trabalho" class="input" />
          <input v-model="novoUsuario.rua" placeholder="Rua" class="input" />
          <input v-model="novoUsuario.bairro" placeholder="Bairro" class="input" />
          <input v-model="novoUsuario.cidade" placeholder="Cidade" class="input" />
          <input v-model="novoUsuario.numero_casa" placeholder="Número da Casa" class="input" />
          <input v-model="novoUsuario.complemento" placeholder="Complemento" class="input" />
          <input v-model="novoUsuario.cep" placeholder="CEP" class="input" />
          <select v-model="novoUsuario.patente" class="input">
            <option value="SB">Subtenente</option>
            <option value="A">Atirador</option>
            <option value="S">Sargento</option>
            <option value="C">Cabo</option>
          </select>
          <select v-model="novoUsuario.comandante" class="input">
            <option value="S">Comandante</option>
            <option value="N">Não comandante</option>
          </select>
          <input type="file" @change="onFileChange" class="input-file" />
        </div>
        <div class="botoes">
          <button @click="cadastrarOuAtualizarUsuario" class="btn-salvar">
            {{ editandoId ? 'Salvar' : 'Cadastrar' }}
          </button>
          <button v-if="editandoId" @click="limparFormulario" class="btn-cancelar">Cancelar</button>
        </div>
      </div>
      <div class="busca">
        <h2 class="subtitulo">Buscar Usuário</h2>
        <input v-model="termoBusca" placeholder="Buscar por nome de guerra" class="input busca-input" />
      </div>
      <table class="tabela">
        <thead>
          <tr>  
            <th>Número</th>
            <th>Nome</th>
            <th>Guerra</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Comandante</th>
            <th>Patente</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.id"> 
            <td>{{ user.numero_atirador }}</td>
            <td>{{ user.nome_completo }}</td>
            <td>{{ user.nome_guerra }}</td>
            <td>{{ user.cpf }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.comandante }}</td>
            <td>{{ user.patente }}</td>
            <td>
              <button @click="editarUsuario(user)" class="acao editar">Editar</button>
              <button @click="confirmarExclusao(user)" class="acao excluir">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="mostrarConfirmacao" class="modal-overlay">
  <div class="modal">
    <p>Deseja realmente excluir <strong>{{ usuarioASerDeletado.nome_completo }}</strong>?</p>
    <div class="modal-botoes">
      <button class="btn-salvar" @click="deletarUsuarioConfirmado">Sim</button>
      <button class="btn-cancelar" @click="mostrarConfirmacao = false">Cancelar</button>
    </div>
  </div>
</div>
</template>

<style scoped>
.tela-usuario {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
  
}

.container {
  background-color: #fff;
  border-radius: 12px;
  max-width: 1100px;
  margin: 0 auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;

}

.titulo {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1a3e2a;
  text-align: center;
}

.editando {
  color: #c47f00;
  font-weight: 600;
  margin-bottom: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.input-file {
  margin-top: 10px;
}

.botoes {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.btn-salvar {
  background-color: #1a3e2a;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.btn-cancelar {
  background-color: #ccc;
  color: #333;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.busca {
  margin-top: 20px;
  margin-bottom: 20px;
}

.subtitulo {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.tabela th,
.tabela td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.tabela th {
  background-color: #e3e3e3;
}

.acao {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.editar {
  color: #1a3e2a;
}

.excluir {
  color: #c0392b;
  margin-left: 8px;
}

.mensagem {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  animation: fadeIn 0.3s ease;
}

.mensagem.sucesso {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.mensagem.erro {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

</style>
