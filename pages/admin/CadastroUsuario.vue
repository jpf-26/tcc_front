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

watch(termoBusca, carregarUsuarios);
onMounted(carregarUsuarios);

function onFileChange(event) {
  novoUsuario.value.foto = event.target.files[0];
}
</script>


<template>
  <div>
    <Navbar />

    <div class="p-4 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Cadastro de Usuário</h1>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <h2 class="text-lg font-semibold mb-2" v-if="editandoId">
          Editando usuário: {{ novoUsuario.nome_completo }}
        </h2>
        <input v-model="novoUsuario.nome_completo" placeholder="Nome Completo" class="input" />
        <input v-model="novoUsuario.nome_guerra" placeholder="Nome de Guerra" class="input" />
        <input v-model="novoUsuario.numero_atirador" placeholder="Número Atirador" type="number" class="input" />
        <input v-model="novoUsuario.cpf" placeholder="CPF" class="input" />
        <input v-model="novoUsuario.ra" placeholder="R.A" class="input" />
        <input v-model="novoUsuario.email" placeholder="Email" type="email" class="input" />
        <input v-model="novoUsuario.password" placeholder="Senha" type="password" class="input" />
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
        <input type="file" @change="onFileChange" />
      </div>

      <button @click="cadastrarOuAtualizarUsuario" class="bg-blue-600 text-white px-4 py-2 rounded mr-2">
        {{ editandoId ? "Salvar Alterações" : "Cadastrar" }}
      </button>
      <button v-if="editandoId" @click="limparFormulario" class="bg-gray-500 text-white px-4 py-2 rounded">
        Cancelar
      </button>

      <div class="mt-10">
        <h2 class="text-xl font-semibold mb-2">Buscar Usuário</h2>
        <input
          v-model="termoBusca"
          placeholder="Buscar por nome, CPF, nome de guerra..."
          class="input mb-4 w-full"
        />

        <table class="w-full text-left border text-sm">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2 border">ID</th>
              <th class="p-2 border">Número</th>
              <th class="p-2 border">Nome</th>
              <th class="p-2 border">Guerra</th>
              <th class="p-2 border">CPF</th>
              <th class="p-2 border">Email</th>
              <th class="p-2 border">Comandante</th>
              <th class="p-2 border">Patente</th>
              <th class="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usuarios" :key="user.id" class="hover:bg-gray-100">
              <td class="p-2 border">{{ user.id }}</td>
              <td class="p-2 border">{{ user.numero_atirador }}</td>
              <td class="p-2 border">{{ user.nome_completo }}</td>
              <td class="p-2 border">{{ user.nome_guerra }}</td>
              <td class="p-2 border">{{ user.cpf }}</td>
              <td class="p-2 border">{{ user.email }}</td>
              <td class="p-2 border">{{ user.comandante }}</td>
              <td class="p-2 border">{{ user.patente }}</td>
              <td class="p-2 border">
                <button @click="editarUsuario(user)" class="text-blue-600 hover:underline">
                  Editar
                </button>
                <button @click="deletarUsuario(user.id)" class="text-red-600 hover:underline ml-2">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
