// Utils
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// 1. Tabela Usuarios
class Usuario {
  constructor(nomeCompleto, email, senha, perfil = 'Aluno') {
    this.id_Usuario = generateId();
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.senhaHash = btoa(senha); // Simulação de hash simples
    this.dataCadastro = new Date().toISOString();
    this.perfil = perfil; // 'Admin' ou 'Aluno' ou 'Instrutor'
  }
}

// 2. Tabela Categorias
class Categoria {
  constructor(nome, descricao) {
    this.id_Categoria = generateId();
    this.nome = nome;
    this.descricao = descricao;
  }
}

// 3. Tabela Cursos
class Curso {
  constructor(titulo, descricao, id_Instrutor, id_Categoria, nivel) {
    this.id_Curso = generateId();
    this.titulo = titulo;
    this.descricao = descricao;
    this.id_Instrutor = id_Instrutor;
    this.id_Categoria = id_Categoria;
    this.nivel = nivel; // Iniciante, Intermediário, Avançado
    this.dataPublicacao = new Date().toISOString();
    this.totalAulas = 0;
    this.totalHoras = 0;
  }
}

// 4. Tabela Modulos
class Modulo {
  constructor(id_Curso, titulo, ordem) {
    this.id_Modulo = generateId();
    this.id_Curso = id_Curso;
    this.titulo = titulo;
    this.ordem = ordem;
  }
}

// 5. Tabela Aulas
class Aula {
  constructor(id_Modulo, titulo, tipoConteudo, url_Conteudo, duracaoMinutos, ordem) {
    this.id_Aula = generateId();
    this.id_Modulo = id_Modulo;
    this.titulo = titulo;
    this.tipoConteudo = tipoConteudo; // Vídeo, Texto, Quiz
    this.url_Conteudo = url_Conteudo;
    this.duracaoMinutos = duracaoMinutos;
    this.ordem = ordem;
  }
}

// 6. Tabela Matriculas
class Matricula {
  constructor(id_Usuario, id_Curso) {
    this.id_Matricula = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Curso = id_Curso;
    this.dataMatricula = new Date().toISOString();
    this.dataConclusao = null;
  }
}

// 7. Tabela Progresso_Aulas
class ProgressoAula {
  constructor(id_Usuario, id_Aula) {
    this.id_Usuario = id_Usuario; // PK composta simulada
    this.id_Aula = id_Aula; // PK composta simulada
    this.dataConclusao = new Date().toISOString();
    this.status = 'Concluído';
  }
}

// 8. Tabela Avaliacoes
class Avaliacao {
  constructor(id_Usuario, id_Curso, nota, comentario) {
    this.id_Avaliacao = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Curso = id_Curso;
    this.nota = nota;
    this.comentario = comentario;
    this.dataAvaliacao = new Date().toISOString();
  }
}

// 9. Tabela Trilhas
class Trilha {
  constructor(titulo, descricao, id_Categoria) {
    this.id_Trilha = generateId();
    this.titulo = titulo;
    this.descricao = descricao;
    this.id_Categoria = id_Categoria;
  }
}

// 10. Tabela Trilhas_Cursos
class TrilhaCurso {
  constructor(id_Trilha, id_Curso, ordem) {
    this.id_Trilha = id_Trilha;
    this.id_Curso = id_Curso;
    this.ordem = ordem;
  }
}

// 11. Tabela Certificados
class Certificado {
  constructor(id_Usuario, id_Curso, id_Trilha = null) {
    this.id_Certificado = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Curso = id_Curso;
    this.id_Trilha = id_Trilha;
    this.codigoVerificacao = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    this.dataEmissao = new Date().toISOString();
  }
}

// 12. Tabela Planos
class Plano {
  constructor(nome, descricao, preco, duracaoMeses) {
    this.id_Plano = generateId();
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.duracaoMeses = duracaoMeses;
  }
}

// 13. Tabela Assinaturas
class Assinatura {
  constructor(id_Usuario, id_Plano) {
    this.id_Assinatura = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Plano = id_Plano;
    this.dataInicio = new Date().toISOString();
    // Simula cálculo de data fim baseado no plano a ser tratado antes.
    this.dataFim = new Date();
    this.dataFim.setMonth(this.dataFim.getMonth() + 1); // Mock 1 mês
    this.dataFim = this.dataFim.toISOString();
  }
}

// 14. Tabela Pagamentos
class Pagamento {
  constructor(id_Assinatura, valorPago, metodoPagamento) {
    this.id_Pagamento = generateId();
    this.id_Assinatura = id_Assinatura;
    this.valorPago = valorPago;
    this.dataPagamento = new Date().toISOString();
    this.metodoPagamento = metodoPagamento;
    this.id_Transacao_Gateway = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}

// O Store interage com o localStorage para persistir dados.
class Store {
  // Collections representam as "tabelas"
  static tables = [
    'usuarios', 'categorias', 'cursos', 'modulos', 'aulas',
    'matriculas', 'progressoAulas', 'avaliacoes', 'trilhas',
    'trilhasCursos', 'certificados', 'planos', 'assinaturas', 'pagamentos'
  ];

  static init() {
    this.tables.forEach(table => {
      if (!localStorage.getItem(table)) {
        localStorage.setItem(table, JSON.stringify([]));
      }
    });

    if (this.getAll('usuarios').length === 0) {
      this.seedData();
    }
  }

  static getTable(table) {
    return JSON.parse(localStorage.getItem(table) || '[]');
  }

  static setTable(table, data) {
    localStorage.setItem(table, JSON.stringify(data));
  }

  static getAll(table) {
    return this.getTable(table);
  }

  static getById(table, idKey, idValue) {
    const data = this.getTable(table);
    return data.find(item => item[idKey] === idValue);
  }

  static insert(table, obj) {
    const data = this.getTable(table);
    data.push(obj);
    this.setTable(table, data);
    return obj;
  }

  static update(table, idKey, idValue, newObj) {
    let data = this.getTable(table);
    const index = data.findIndex(item => item[idKey] === idValue);
    if (index !== -1) {
      data[index] = { ...data[index], ...newObj };
      this.setTable(table, data);
      return data[index];
    }
    return null;
  }

  static delete(table, idKey, idValue) {
    let data = this.getTable(table);
    data = data.filter(item => item[idKey] !== idValue);
    this.setTable(table, data);
  }

  static seedData() {
    console.log("Mocking initial seed data...");

    // 1. Usuários Base
    const admin = new Usuario('Administrador', 'admin@plataforma.com', 'admin123', 'Admin');
    const instrutor = new Usuario('João Instrutor', 'instrutor@plataforma.com', '123456', 'Instrutor');
    const aluno = new Usuario('Maria Aluna', 'aluno@plataforma.com', '123456', 'Aluno');
    this.insert('usuarios', admin);
    this.insert('usuarios', instrutor);
    this.insert('usuarios', aluno);

    // 2. Categorias
    const catDev = new Categoria('Desenvolvimento', 'Cursos de programação e tech');
    const catDesign = new Categoria('Design Moderno', 'UI/UX e Ferramentas');
    this.insert('categorias', catDev);
    this.insert('categorias', catDesign);

    // 3. Cursos
    const cursoJs = new Curso('JavaScript Avançado', 'Domine Vanilla JS e ES6+', instrutor.id_Usuario, catDev.id_Categoria, 'Avançado');
    const cursoUI = new Curso('Master UI Design', 'Design focado em WOW effect', instrutor.id_Usuario, catDesign.id_Categoria, 'Iniciante');
    this.insert('cursos', cursoJs);
    this.insert('cursos', cursoUI);

    // 4. Módulos & Aulas (Para o Curso de JS)
    const mod1 = new Modulo(cursoJs.id_Curso, 'Fundamentos ES6+', 1);
    this.insert('modulos', mod1);

    const aula1 = new Aula(mod1.id_Modulo, 'Let, Const e Arrow Functions', 'Vídeo', 'https://video.url', 15, 1);
    const aula2 = new Aula(mod1.id_Modulo, 'Classes em JS', 'Texto', 'https://texto.url', 20, 2);
    this.insert('aulas', aula1);
    this.insert('aulas', aula2);

    // 5. Planos Financeiros
    const planoBasic = new Plano('Básico', 'Acesso a cursos de nível iniciante.', 29.90, 1);
    const planoPro = new Plano('Pro', 'Acesso ilimitado a todas as trilhas e cursos premium.', 69.90, 1);
    this.insert('planos', planoBasic);
    this.insert('planos', planoPro);

    // 6. Trilhas
    const trilhaFullstack = new Trilha('Trilha Front-end Master', 'De iniciante a avançado', catDev.id_Categoria);
    this.insert('trilhas', trilhaFullstack);
    this.insert('trilhasCursos', new TrilhaCurso(trilhaFullstack.id_Trilha, cursoUI.id_Curso, 1));
    this.insert('trilhasCursos', new TrilhaCurso(trilhaFullstack.id_Trilha, cursoJs.id_Curso, 2));

    console.log("Mock data loaded.");
  }
}

class UI {
  // Cria um Toast dinâmico para feedback visual maravilhoso
  static showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || UI.createToastContainer();
    const toastId = 'toast-' + Date.now();

    let bgClass = 'bg-primary';
    if (type === 'success') bgClass = 'bg-success';
    if (type === 'error') bgClass = 'bg-danger';
    if (type === 'warning') bgClass = 'bg-warning text-dark';

    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body fw-bold">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    // Removemos via DOM API nativa pois importamos o bootstrap.bundle globalmente
    const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    bsToast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  static createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
  }

  // Preenche um <select> iterando um array de objetos
  static populateSelect(selectId, dataArray, valueKey, labelKey, defaultText = "Selecione...") {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="">${defaultText}</option>`;
    dataArray.forEach(item => {
      const option = document.createElement('option');
      option.value = item[valueKey];
      option.textContent = item[labelKey];
      select.appendChild(option);
    });
  }
}


function navigateTo(viewId) {
  document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  App.setupNavigation(currentUser);

  if (viewId === 'view-dashboard-admin' && typeof initAdmin === 'function') initAdmin();
  else if (viewId === 'view-dashboard-user' && typeof initUser === 'function') initUser();
  else if (viewId === 'view-checkout' && typeof initCheckout === 'function') initCheckout();
}

document.addEventListener('DOMContentLoaded', () => { navigateTo('view-index'); });

// app.js - Arquivo central e controle de Autenticação / Incialização
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa a camada de dados (seeding se necessário)
  Store.init();

  // Verifica Sessão atual
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  App.setupNavigation(currentUser);

  // Se form de login existir na landing page
  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      App.handleLogin();
    });
  }

  const formRegister = document.getElementById('formRegister');
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      App.handleRegister();
    });
  }
});

class App {
  static setupNavigation(user) {
    const navRights = document.querySelectorAll('.nav-right');
    if (navRights.length === 0) return;

    navRights.forEach((navRight) => {
      if (user) {
        // Logged in
        let dashboardLink = user.perfil === 'Aluno' ? "navigateTo('view-dashboard-user')" : "navigateTo('view-dashboard-admin')";
        navRight.innerHTML = `
          <span class="nav-link">Olá, <b>${user.nomeCompleto.split(' ')[0]}</b></span>
          <button onclick="${dashboardLink}" class="btn btn-outline-primary ms-2 btn-sm">Meu Dashboard</button>
          <button onclick="App.logout()" class="btn btn-light ms-2 btn-sm text-dark">Sair</button>
        `;
      } else {
        // Logged out
        navRight.innerHTML = `
          <button type="button" class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal"> Entrar </button>
          <button onclick="navigateTo('view-checkout')" class="btn btn-gradient"> Assinar Agora </button>
        `;
      }
    });
  }

  static handleLogin() {
    const emailInput = document.getElementById('loginEmail').value;
    const pwdInput = document.getElementById('loginPassword').value;

    const usuarios = Store.getAll('usuarios');
    const user = usuarios.find(u => u.email === emailInput);

    if (user) {
      // Simulando checagem de hash simplória apenas para laboratório
      const inputHash = btoa(pwdInput);
      if (user.senhaHash === inputHash) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        UI.showToast('Login realizado com sucesso!', 'success');

        // Redireciona de acordo com perfil
        setTimeout(() => {
          let inst = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
          if (inst) inst.hide();

          if (user.perfil === 'Aluno') {
            navigateTo('view-dashboard-user');
          } else {
            navigateTo('view-dashboard-admin');
          }
        }, 1000);
      } else {
        UI.showToast('Senha inválida', 'error');
      }
    } else {
      UI.showToast('Usuário não encontrado', 'error');
    }
  }

  static handleRegister() {
    const nome = document.getElementById('regNome').value;
    const email = document.getElementById('regEmail').value;
    const senha = document.getElementById('regSenha').value;

    const usuarios = Store.getAll('usuarios');
    if (usuarios.find(u => u.email === email)) {
      UI.showToast('Email já está em uso', 'error');
      return;
    }

    const newUser = new Usuario(nome, email, senha, 'Aluno');
    Store.insert('usuarios', newUser);

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    UI.showToast('Conta criada com sucesso!', 'success');

    setTimeout(() => {
      let inst = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      if (inst) inst.hide();
      navigateTo('view-dashboard-user');
    }, 1000);
  }

  static logout() {
    localStorage.removeItem('currentUser');
    navigateTo('view-index');
  }
}

function initAdmin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.perfil !== 'Admin') {
    UI.showToast("Acesso Restrito: Apenas Administradores.", 'error');
    setTimeout(() => { navigateTo('view-index'); }, 2000);
    return;
  }

  // Initial Render
  renderCategorias();
  renderCursos();
  renderTrilhas();
  populateDropdowns();
}

document.addEventListener('DOMContentLoaded', () => {

  // Listeners Formulários
  document.getElementById('formCategoria').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('catNome').value;
    const desc = document.getElementById('catDesc').value;
    const cat = new Categoria(nome, desc);
    Store.insert('categorias', cat);
    UI.showToast("Categoria adicionada com sucesso!");
    bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
    e.target.reset();
    renderCategorias();
    populateDropdowns();
  });

  document.getElementById('formCurso').addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('curTitulo').value;
    const idCat = document.getElementById('curCategoria').value;
    const idIns = document.getElementById('curInstrutor').value;
    const nivel = document.getElementById('curNivel').value;
    const desc = document.getElementById('curDesc').value;

    const curso = new Curso(titulo, desc, idIns, idCat, nivel);
    Store.insert('cursos', curso);
    UI.showToast("Curso adicionado com sucesso!");
    bootstrap.Modal.getInstance(document.getElementById('modalCurso')).hide();
    e.target.reset();
    renderCursos();
    populateDropdowns();
  });

  document.getElementById('formEditarCurso').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editCurId').value;
    const titulo = document.getElementById('editCurTitulo').value;
    const idCat = document.getElementById('editCurCategoria').value;
    const idIns = document.getElementById('editCurInstrutor').value;
    const nivel = document.getElementById('editCurNivel').value;
    const desc = document.getElementById('editCurDesc').value;

    Store.update('cursos', 'id_Curso', id, { titulo, id_Categoria: idCat, id_Instrutor: idIns, nivel, descricao: desc });
    UI.showToast("Curso atualizado com sucesso!");
    bootstrap.Modal.getInstance(document.getElementById('modalEditarCurso')).hide();
    renderCursos();
    populateDropdowns();
  });

  document.getElementById('formAula').addEventListener('submit', (e) => {
    e.preventDefault();
    const cursoId = document.getElementById('aulaCurso').value;
    const titulo = document.getElementById('aulaTitulo').value;
    const tipo = document.getElementById('aulaTipo').value;
    const aulaUrlInput = document.getElementById('aulaUrl').value;
    const min = document.getElementById('aulaMin').value;

    // Ensure "Módulo 1" exists for this course
    let modulosC = Store.getAll('modulos').filter(m => m.id_Curso === cursoId);
    let moduloSelecionado = null;
    if (modulosC.length === 0) {
      moduloSelecionado = new Modulo(cursoId, 'Módulo 1: Introdução', 1);
      Store.insert('modulos', moduloSelecionado);
    } else {
      moduloSelecionado = modulosC[0];
    }

    // Add class
    const aulasMod = Store.getAll('aulas').filter(a => a.id_Modulo === moduloSelecionado.id_Modulo);
    const nextOrder = aulasMod.length + 1;
    const urlFinal = aulaUrlInput ? aulaUrlInput : ("https://aula.static.video/" + nextOrder);

    const aula = new Aula(moduloSelecionado.id_Modulo, titulo, tipo, urlFinal, parseInt(min), nextOrder);
    Store.insert('aulas', aula);

    UI.showToast("Aula adicionada na grade do curso!");
    bootstrap.Modal.getInstance(document.getElementById('modalAula')).hide();
    e.target.reset();
  });

  document.getElementById('formTrilha').addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('triTitulo').value;
    const idCat = document.getElementById('triCategoria').value;
    const desc = document.getElementById('triDesc').value;

    const trilha = new Trilha(titulo, desc, idCat);
    Store.insert('trilhas', trilha);
    UI.showToast("Trilha adicionada com sucesso!");
    bootstrap.Modal.getInstance(document.getElementById('modalTrilha')).hide();
    e.target.reset();
    renderTrilhas();
  });
});

function renderCategorias() {
  const table = document.getElementById('tabelaCategorias');
  const items = Store.getAll('categorias');
  table.innerHTML = '';
  items.forEach(c => {
    table.innerHTML += `<tr><td><small class="text-muted">${c.id_Categoria}</small></td><td>${c.nome}</td><td>${c.descricao}</td></tr>`;
  });
}

function renderCursos() {
  const table = document.getElementById('tabelaCursos');
  const cursos = Store.getAll('cursos');
  const instrutores = Store.getAll('usuarios');
  const categorias = Store.getAll('categorias');

  table.innerHTML = '';
  cursos.forEach(c => {
    const catNome = categorias.find(cat => cat.id_Categoria === c.id_Categoria)?.nome || 'N/A';
    const insNome = instrutores.find(u => u.id_Usuario === c.id_Instrutor)?.nomeCompleto || 'N/A';
    const qModulos = Store.getAll('modulos').filter(m => m.id_Curso === c.id_Curso).length;

    table.innerHTML += `<tr>
            <td class="fw-bold">${c.titulo}</td>
            <td><span class="badge badge-glass text-info">${c.nivel}</span></td>
            <td>${insNome}</td>
            <td>${catNome}</td>
            <td>
              <button class="btn btn-sm btn-outline-warning me-1" onclick="abrirModalEditarCurso('${c.id_Curso}')">Editar</button>
              <button class="btn btn-sm btn-outline-danger" onclick="deletarCurso('${c.id_Curso}')">Excluir</button>
            </td>
        </tr>`;
  });
}

window.deletarCurso = function (id) {
  if (confirm("Tem certeza que deseja excluir este curso?")) {
    // Remover aulas/módulos ligados ao curso pra manter integridade não é estritamente mas é bom gosto
    const modulos = Store.getAll('modulos').filter(m => m.id_Curso === id);
    modulos.forEach(m => Store.delete('modulos', 'id_Modulo', m.id_Modulo));

    Store.delete('cursos', 'id_Curso', id);
    UI.showToast("Curso excluído com sucesso!", "success");
    renderCursos();
  }
};

window.abrirModalEditarCurso = function (id) {
  const curso = Store.getById('cursos', 'id_Curso', id);
  if (!curso) return;
  document.getElementById('editCurId').value = curso.id_Curso;
  document.getElementById('editCurTitulo').value = curso.titulo;
  document.getElementById('editCurCategoria').value = curso.id_Categoria;
  document.getElementById('editCurInstrutor').value = curso.id_Instrutor;
  document.getElementById('editCurNivel').value = curso.nivel;
  document.getElementById('editCurDesc').value = curso.descricao;

  const modal = new bootstrap.Modal(document.getElementById('modalEditarCurso'));
  modal.show();
};

function renderTrilhas() {
  const table = document.getElementById('tabelaTrilhas');
  if (!table) return;
  const trilhas = Store.getAll('trilhas');
  const categorias = Store.getAll('categorias');

  table.innerHTML = '';
  trilhas.forEach(t => {
    const catNome = categorias.find(cat => cat.id_Categoria === t.id_Categoria)?.nome || 'N/A';
    table.innerHTML += `<tr>
            <td class="fw-bold">${t.titulo}</td>
            <td><span class="badge badge-glass text-info">${catNome}</span></td>
            <td>${t.descricao}</td>
        </tr>`;
  });
}

function populateDropdowns() {
  UI.populateSelect('curCategoria', Store.getAll('categorias'), 'id_Categoria', 'nome');
  UI.populateSelect('triCategoria', Store.getAll('categorias'), 'id_Categoria', 'nome');
  const staffs = Store.getAll('usuarios').filter(u => u.perfil !== 'Aluno');
  UI.populateSelect('curInstrutor', staffs, 'id_Usuario', 'nomeCompleto');
  UI.populateSelect('aulaCurso', Store.getAll('cursos'), 'id_Curso', 'titulo');

  UI.populateSelect('editCurCategoria', Store.getAll('categorias'), 'id_Categoria', 'nome');
  UI.populateSelect('editCurInstrutor', staffs, 'id_Usuario', 'nomeCompleto');
}

function initUser() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.perfil !== 'Aluno') {
    UI.showToast("Acesso Negado. Esta página é para alunos.", 'error');
    setTimeout(() => { navigateTo('view-index'); }, 2000);
    return;
  }

  // Verifica se aluno tem assinatura válida
  const assinaturas = Store.getAll('assinaturas');
  const userAssinatura = assinaturas.find(a => a.id_Usuario === currentUser.id_Usuario);

  if (!userAssinatura) {
    // Aluno não tem assinatura: liberar apenas Mock Enrollment ou redirecionar.
    // Mas para o LAB, vamos automatizar a matrícula nos dois cursos mocks como Fallback
    autoEnrollMockCourses(currentUser);
  }

  renderMyCourses(currentUser);
  renderCertificates(currentUser);
}

function autoEnrollMockCourses(user) {
  const cursos = Store.getAll('cursos');
  const matriculas = Store.getAll('matriculas');
  cursos.forEach(c => {
    // Verifica se ja ta matriculado
    if (!matriculas.find(m => m.id_Curso === c.id_Curso && m.id_Usuario === user.id_Usuario)) {
      Store.insert('matriculas', new Matricula(user.id_Usuario, c.id_Curso));
    }
  });
}

function renderMyCourses(user) {
  const matriculas = Store.getAll('matriculas').filter(m => m.id_Usuario === user.id_Usuario);
  const cursos = Store.getAll('cursos');
  const container = document.getElementById('listaCursosEnrolados');
  container.innerHTML = '';

  if (matriculas.length === 0) {
    container.innerHTML = `<p class="text-muted w-100 text-center">Você não tem cursos ativos.</p>`;
    return;
  }

  matriculas.forEach(matricula => {
    const curso = cursos.find(c => c.id_Curso === matricula.id_Curso);
    if (!curso) return;

    const html = `
      <div class="col">
        <div class="card glass-card h-100 cursor-pointer" onclick="openCurso('${curso.id_Curso}')">
          <div class="card-body">
            <span class="badge bg-secondary mb-2">${curso.nivel}</span>
            <h5 class="card-title fw-bold">${curso.titulo}</h5>
            <p class="card-text text-muted small">${curso.descricao}</p>
            <button class="btn btn-outline-primary w-100 mt-2">Continuar Estudando</button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

let activeCourseId = null;

function openCurso(cursoId) {
  activeCourseId = cursoId;
  const curso = Store.getById('cursos', 'id_Curso', cursoId);
  document.getElementById('salaCursoTitulo').textContent = curso.titulo;

  const modulos = Store.getAll('modulos').filter(m => m.id_Curso === cursoId).sort((a, b) => a.ordem - b.ordem);
  const aulasAll = Store.getAll('aulas');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const progresso = Store.getAll('progressoAulas').filter(p => p.id_Usuario === user.id_Usuario);

  const accordion = document.getElementById('modulosAccordion');
  accordion.innerHTML = '';

  let totalAulas = 0;
  let concluidas = 0;

  modulos.forEach((modulo, index) => {
    const aulasDoModulo = aulasAll.filter(a => a.id_Modulo === modulo.id_Modulo).sort((a, b) => a.ordem - b.ordem);

    let aulasHtml = '';
    aulasDoModulo.forEach(aula => {
      totalAulas++;
      const isConcluida = progresso.some(p => p.id_Aula === aula.id_Aula);
      if (isConcluida) concluidas++;

      const checkIcon = isConcluida ? '✅' : '⏳';
      aulasHtml += `
        <button class="list-group-item list-group-item-action bg-transparent text-light border-0 py-2 d-flex justify-content-between align-items-center" onclick="viewAula('${aula.id_Aula}')">
          <span>${checkIcon} ${aula.ordem}. ${aula.titulo}</span>
          <span class="badge bg-dark">${aula.tipoConteudo}</span>
        </button>
      `;
    });

    const isFirst = index === 0 ? 'show' : '';
    const collapseButtonClass = index === 0 ? '' : 'collapsed';

    const render = `
      <div class="accordion-item bg-transparent border-0 mb-2 border-bottom" style="border-color: rgba(255,255,255,0.1) !important;">
        <h2 class="accordion-header">
          <button class="accordion-button ${collapseButtonClass} bg-transparent text-light fw-bold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMod${index}">
            Módulo ${modulo.ordem}: ${modulo.titulo}
          </button>
        </h2>
        <div id="collapseMod${index}" class="accordion-collapse collapse ${isFirst}" data-bs-parent="#modulosAccordion">
          <div class="accordion-body p-0 pt-2">
            <div class="list-group list-group-flush rounded-0">
               ${aulasHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    accordion.insertAdjacentHTML('beforeend', render);
  });

  // Atualizar Barra
  const perc = totalAulas === 0 ? 0 : Math.round((concluidas / totalAulas) * 100);
  document.getElementById('cursoProgressoPercent').textContent = `${perc}%`;
  document.getElementById('cursoProgressBar').style.width = `${perc}%`;

  const btnCert = document.getElementById('btnEmitirCertificado');
  if (totalAulas > 0 && perc === 100) {
    btnCert.classList.remove('d-none');
    btnCert.onclick = () => emitirCertificado(user.id_Usuario, curso.id_Curso);
  } else {
    btnCert.classList.add('d-none');
  }

  const modal = new bootstrap.Modal(document.getElementById('salaAulaModal'));
  modal.show();
}

function viewAula(aulaId) {
  const aula = Store.getById('aulas', 'id_Aula', aulaId);
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const progresso = Store.getAll('progressoAulas').find(p => p.id_Aula === aulaId && p.id_Usuario === user.id_Usuario);

  const visor = document.getElementById('aulaVisor');

  let playerHtml = '';
  if (aula.tipoConteudo === 'Vídeo') {
    let ytId = null;
    if (aula.url_Conteudo) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
      const match = aula.url_Conteudo.match(regExp);
      if (match && match[2].length === 11) {
        ytId = match[2];
      } else if (aula.url_Conteudo.length === 11) {
        ytId = aula.url_Conteudo; // fallback para IDs curtos diretos
      }
    }

    if (!ytId) {
      const randomYoutubeIds = ['AwGdivC83t8', 'E0jI0wkX5pk', 'FCTFRpXdgEw', 'VW1kAd4Acr4'];
      ytId = randomYoutubeIds[Math.floor(Math.random() * randomYoutubeIds.length)];
    }

    playerHtml = `
      <div class="bg-dark w-100 rounded d-flex align-items-center justify-content-center" style="height: 400px; border: 2px dashed rgba(255,255,255,0.2); overflow: hidden;">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytId}?autoplay=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>`;
  } else {
    playerHtml = `
      <div class="bg-dark p-4 rounded text-start" style="min-height: 400px; border: 1px solid rgba(255,255,255,0.1);">
         <h5 class="fw-bold mb-3">Material de Leitura</h5>
         <p class="text-muted">Lendo conteúdo de: ${aula.url_Conteudo}</p>
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>`;
  }

  const btnHtml = progresso
    ? `<button class="btn btn-secondary mt-4 w-100 disabled">Aula Concluída ✅</button>`
    : `<button class="btn btn-gradient mt-4 w-100" onclick="marcarAulaConcluida('${aula.id_Aula}')">Marcar como Concluída</button>`;

  visor.innerHTML = `
    <h3 class="fw-bold text-start mb-4">${aula.titulo}</h3>
    ${playerHtml}
    ${btnHtml}
  `;
}

function marcarAulaConcluida(aulaId) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  Store.insert('progressoAulas', new ProgressoAula(user.id_Usuario, aulaId));
  UI.showToast("Aula concluída!", "success");

  // Refresh UI logic
  openCurso(activeCourseId);
  // Also keeps visor on the same class by clicking it again
  viewAula(aulaId);
}

function emitirCertificado(userId, cursoId) {
  const certs = Store.getAll('certificados');
  if (!certs.find(c => c.id_Curso === cursoId && c.id_Usuario === userId)) {
    Store.insert('certificados', new Certificado(userId, cursoId, null));
    UI.showToast("Certificado emitido e disponível na aba correspondente!", "success");
    renderCertificates(JSON.parse(localStorage.getItem('currentUser')));
  } else {
    UI.showToast("Você já possui o certificado deste curso.", "warning");
  }
}

function renderCertificates(user) {
  const certs = Store.getAll('certificados').filter(c => c.id_Usuario === user.id_Usuario);
  const cursos = Store.getAll('cursos');
  const container = document.getElementById('listaCertificados');
  container.innerHTML = '';

  if (certs.length === 0) {
    container.innerHTML = `<li class="list-group-item bg-transparent text-muted border-0">Nenhum certificado ainda. Continue estudando!</li>`;
    return;
  }

  certs.forEach(cert => {
    const curso = cursos.find(c => c.id_Curso === cert.id_Curso);
    container.insertAdjacentHTML('beforeend', `
       <li class="list-group-item bg-transparent border-0 border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
         <div class="text-start">
           <h6 class="fw-bold m-0 text-light">${curso.titulo}</h6>
           <small class="text-muted">Data: ${new Date(cert.dataEmissao).toLocaleDateString()} | Código SHA: <span class="text-primary font-monospace">${cert.codigoVerificacao}</span></small>
         </div>
         <span class="fs-2 text-warning">🎓</span>
       </li>
    `);
  });
}

function initCheckout() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const area = document.getElementById('checkoutArea');
  const warning = document.getElementById('checkoutAuthWarning');

  if (!user || user.perfil !== 'Aluno') {
    area.classList.add('d-none');
    warning.classList.remove('d-none');
    return;
  }

  area.classList.remove('d-none');
  warning.classList.add('d-none');

  renderPlanos();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formCheckout').addEventListener('submit', handlePayment);
});

let selectedPlano = null;

function renderPlanos() {
  const planos = Store.getAll('planos');
  const container = document.getElementById('planosSelectGroup');
  container.innerHTML = '';

  planos.forEach((p, index) => {
    const isSelected = index === 0 ? 'bg-primary bg-opacity-25 border-primary active-plan' : 'bg-transparent';
    if (index === 0) selectPlano(p.id_Plano, p.preco); // Auto-select primeiro

    container.innerHTML += `
        <label class="list-group-item list-group-item-action cursor-pointer rounded mb-3 glass-card ${isSelected}" id="plan-card-${p.id_Plano}" onclick="selectPlano('${p.id_Plano}', ${p.preco})">
            <div class="d-flex w-100 justify-content-between text-light">
               <h5 class="mb-1 fw-bold">${p.nome}</h5>
               <small class="fs-5 pb-0 m-0">R$ ${p.preco.toFixed(2)}</small>
            </div>
            <p class="mb-1 text-muted">${p.descricao}</p>
        </label>
        `;
  });
}

function selectPlano(id, preco) {
  selectedPlano = id;

  // Atualizar UI de seleção
  document.querySelectorAll('[id^="plan-card-"]').forEach(el => {
    el.classList.remove('bg-primary', 'bg-opacity-25', 'border-primary', 'active-plan');
    el.classList.add('bg-transparent');
  });

  const activeEl = document.getElementById(`plan-card-${id}`);
  if (activeEl) {
    activeEl.classList.remove('bg-transparent');
    activeEl.classList.add('bg-primary', 'bg-opacity-25', 'border-primary', 'active-plan');
  }

  // Update Price Display
  document.getElementById('priceDisplay').textContent = `R$ ${preco.toFixed(2)}`;

  // Habilitar botão
  document.getElementById('btnAssinar').classList.remove('disabled');
}

function handlePayment(e) {
  e.preventDefault();
  if (!selectedPlano) return;

  // Loading State
  const btn = document.getElementById('btnAssinar');
  btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';
  btn.classList.add('disabled');

  // Simulate API Delay
  setTimeout(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const planoStr = Store.getById('planos', 'id_Plano', selectedPlano);

    // 1. Criar Assinatura
    const assinatura = new Assinatura(user.id_Usuario, selectedPlano);
    Store.insert('assinaturas', assinatura);

    // 2. Criar Pagamento
    const pagamento = new Pagamento(assinatura.id_Assinatura, planoStr.preco, 'Cartão de Crédito');
    Store.insert('pagamentos', pagamento);

    // UI Feedback
    document.getElementById('txnIdDisplay').textContent = pagamento.id_Transacao_Gateway;
    const sM = new bootstrap.Modal(document.getElementById('successModal'));
    sM.show();
  }, 1500);
}
