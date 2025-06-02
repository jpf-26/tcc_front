<script setup>
import Navbar from "~/pages/navbar.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const API_URL_LISTAR = "http://localhost:8000/usuario/";
const API_URL_CADASTRAR = "http://127.0.0.1:8000/cadastrar_usuario/";

const usuarios = ref([]);
const termoBusca = ref("");
const editandoId = ref(null);

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
    alert("Erro ao carregar usuários: " + (error.response?.data || error.message));
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
        // Envia a foto só se for um novo arquivo (não string de URL)
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
      alert("Usuário atualizado com sucesso!");
    } else {
      await axios.post(API_URL_CADASTRAR, formData, config);
      alert("Usuário cadastrado com sucesso!");
    }

    await carregarUsuarios();
    limparFormulario();
  } catch (error) {
    let msg = "Erro ao cadastrar/editar usuário.";
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        msg += " " + error.response.data;
      } else if (typeof error.response.data === "object") {
        msg += " " + JSON.stringify(error.response.data);
      }
    } else {
      msg += " " + error.message;
    }
    alert(msg);
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

async function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja apagar este usuário?")) {
    try {
      await axios.delete(`http://localhost:8000/deletar_usuario/${id}/`);
      alert("Usuário apagado com sucesso!");
      await carregarUsuarios();
    } catch (error) {
      alert("Erro ao deletar usuário: " + (error.response?.data || error.message));
    }
  }
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
              <button @click="deletarUsuario(user.id)" class="acao excluir">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
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
</style>
