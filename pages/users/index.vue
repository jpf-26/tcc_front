<template>
  <div class="tela-home">
    <Navbar />
    <NuxtPage />
    <div class="conteudo">
      <h1 class="titulo animate-fade-in">Bem-vindo ao TG 02-020</h1>
      <p class="descricao animate-slide-up">
        O Tiro de Guerra é uma instituição militar do Exército Brasileiro, com a missão de formar atiradores e desenvolver o civismo, patriotismo e disciplina entre os jovens. O TG 02-020 atua diretamente na formação de cidadãos mais conscientes, preparados para a vida em sociedade e com espírito de liderança.
      </p>
      <img src="/assets/tg_formacao.jpg" alt="Formatura do Tiro de Guerra" class="imagem-banner animate-zoom-in" />
      <div class="cards">
        <div class="card animate-fade-in">
          <h2 class="card-titulo">Missão</h2>
          <p class="card-texto">
            Formar reservistas com elevados valores éticos e morais, promovendo o civismo e o respeito à pátria, contribuindo para a segurança nacional.
          </p>
        </div>
        <div class="card animate-fade-in delay-100">
          <h2 class="card-titulo">Valores</h2>
          <ul class="card-texto">
            <li>Disciplina</li>
            <li>Patriotismo</li>
            <li>Hierarquia</li>
            <li>Responsabilidade</li>
            <li>Respeito à autoridade</li>
          </ul>
        </div>
        <div class="card animate-fade-in delay-200">
          <h2 class="card-titulo">Atividades</h2>
          <p class="card-texto">
            Os atiradores participam de instruções militares, educação física, palestras formativas, eventos cívicos e ações sociais que visam o bem-estar da comunidade.
          </p>
        </div>
      </div>
      <div class="info-extra">
        <h2>Por que o TG é importante?</h2>
        <p>
          O Tiro de Guerra desempenha um papel fundamental na formação de jovens líderes e na manutenção da cultura patriótica brasileira. Ao ingressar, o atirador adquire experiência de vida, noção de coletividade e prepara-se tanto para o serviço militar quanto para desafios da vida civil.
        </p>
        <img src="/assets/tg_atividade.jpg" alt="Atiradores em atividade física" class="imagem-extra animate-slide-up" />
        <h2>Orgulho de vestir a farda</h2>
        <p>
          Ser atirador é motivo de orgulho. É carregar o compromisso com a ordem, a disciplina e o Brasil no coração. Aqui, cada passo dado é uma conquista e cada guarda montada é uma demonstração de responsabilidade.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '~/pages/navbar.vue'
</script>

<style scoped>
.tela-home {
  background: linear-gradient(135deg, #1a3e2a 50%, #f9d54c 50%);
  min-height: 100vh;
  color: #1a3e2a;
}

.conteudo {
  max-width: 1100px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.titulo {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.descricao {
  font-size: 1.1rem;
  margin-bottom: 30px;
  text-align: center;
}

.imagem-banner {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
}

.card {
  background-color: #f1f5f9;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-titulo {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-texto {
  font-size: 0.95rem;
  line-height: 1.4;
}

.info-extra {
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 40px;
}

.info-extra h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}

.imagem-extra {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Animações */
.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}
.animate-fade-in.delay-100 {
  animation-delay: 0.1s;
}
.animate-fade-in.delay-200 {
  animation-delay: 0.2s;
}
.animate-slide-up {
  animation: slideUp 0.8s ease forwards;
}
.animate-zoom-in {
  animation: zoomIn 0.8s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
