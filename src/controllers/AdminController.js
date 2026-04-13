import Store from '../models/Store.js';
import UI from '../views/UI.js';
import AdminView from '../views/AdminView.js';
import Router from './Router.js';
import Categoria from '../models/Categoria.js';
import Curso from '../models/Curso.js';
import Modulo from '../models/Modulo.js';
import Aula from '../models/Aula.js';
import Trilha from '../models/Trilha.js';

export default class AdminController {
  static initialized = false;

  static init() {
    const currentUser = Store.getCurrentUser();
    if (!currentUser || currentUser.perfil !== 'Admin') {
      UI.showToast("Acesso Restrito: Apenas Administradores.", 'error');
      setTimeout(() => { Router.navigateTo('view-index'); }, 2000);
      return;
    }

    this.refreshView();

    if (!this.initialized) {
      this.bindForms();
      
      AdminView.bindCursoEvents(
        (id) => this.abrirModalEditarCurso(id),
        (id) => this.deletarCurso(id)
      );

      this.initialized = true;
    }
  }

  static refreshView() {
    AdminView.renderCategorias(Store.getAll('categorias'));
    AdminView.renderCursos(Store.getAll('cursos'), Store.getAll('usuarios'), Store.getAll('categorias'), Store.getAll('modulos'));
    AdminView.renderTrilhas(Store.getAll('trilhas'), Store.getAll('categorias'));
    
    AdminView.populateDropdowns(
      Store.getAll('categorias'), 
      Store.getAll('usuarios').filter(u => u.perfil !== 'Aluno'),
      Store.getAll('cursos')
    );
  }

  static bindForms() {
    document.getElementById('formCategoria')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('catNome').value;
      const desc = document.getElementById('catDesc').value;
      const cat = new Categoria(nome, desc);
      Store.insert('categorias', cat);
      UI.showToast("Categoria adicionada com sucesso!");
      window.bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
      e.target.reset();
      this.refreshView();
    });

    document.getElementById('formCurso')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const titulo = document.getElementById('curTitulo').value;
      const idCat = document.getElementById('curCategoria').value;
      const idIns = document.getElementById('curInstrutor').value;
      const nivel = document.getElementById('curNivel').value;
      const desc = document.getElementById('curDesc').value;

      const curso = new Curso(titulo, desc, idIns, idCat, nivel);
      Store.insert('cursos', curso);
      UI.showToast("Curso adicionado com sucesso!");
      window.bootstrap.Modal.getInstance(document.getElementById('modalCurso')).hide();
      e.target.reset();
      this.refreshView();
    });

    document.getElementById('formEditarCurso')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editCurId').value;
      const titulo = document.getElementById('editCurTitulo').value;
      const idCat = document.getElementById('editCurCategoria').value;
      const idIns = document.getElementById('editCurInstrutor').value;
      const nivel = document.getElementById('editCurNivel').value;
      const desc = document.getElementById('editCurDesc').value;

      Store.update('cursos', 'id_Curso', id, { titulo, id_Categoria: idCat, id_Instrutor: idIns, nivel, descricao: desc });
      UI.showToast("Curso atualizado com sucesso!");
      window.bootstrap.Modal.getInstance(document.getElementById('modalEditarCurso')).hide();
      this.refreshView();
    });

    document.getElementById('formAula')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const cursoId = document.getElementById('aulaCurso').value;
      const titulo = document.getElementById('aulaTitulo').value;
      const tipo = document.getElementById('aulaTipo').value;
      const aulaUrlInput = document.getElementById('aulaUrl').value;
      const min = document.getElementById('aulaMin').value;

      let modulosC = Store.getAll('modulos').filter(m => m.id_Curso === cursoId);
      let moduloSelecionado = null;
      if (modulosC.length === 0) {
        moduloSelecionado = new Modulo(cursoId, 'Módulo 1: Introdução', 1);
        Store.insert('modulos', moduloSelecionado);
      } else {
        moduloSelecionado = modulosC[0];
      }

      const aulasMod = Store.getAll('aulas').filter(a => a.id_Modulo === moduloSelecionado.id_Modulo);
      const nextOrder = aulasMod.length + 1;
      const urlFinal = aulaUrlInput ? aulaUrlInput : ("https://aula.static.video/" + nextOrder);

      const aula = new Aula(moduloSelecionado.id_Modulo, titulo, tipo, urlFinal, parseInt(min), nextOrder);
      Store.insert('aulas', aula);

      UI.showToast("Aula adicionada na grade do curso!");
      window.bootstrap.Modal.getInstance(document.getElementById('modalAula')).hide();
      e.target.reset();
    });

    document.getElementById('formTrilha')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const titulo = document.getElementById('triTitulo').value;
      const idCat = document.getElementById('triCategoria').value;
      const desc = document.getElementById('triDesc').value;

      const trilha = new Trilha(titulo, desc, idCat);
      Store.insert('trilhas', trilha);
      UI.showToast("Trilha adicionada com sucesso!");
      window.bootstrap.Modal.getInstance(document.getElementById('modalTrilha')).hide();
      e.target.reset();
      this.refreshView();
    });
  }

  static deletarCurso(id) {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      const modulos = Store.getAll('modulos').filter(m => m.id_Curso === id);
      modulos.forEach(m => Store.delete('modulos', 'id_Modulo', m.id_Modulo));

      Store.delete('cursos', 'id_Curso', id);
      UI.showToast("Curso excluído com sucesso!", "success");
      this.refreshView();
    }
  }

  static abrirModalEditarCurso(id) {
    const curso = Store.getById('cursos', 'id_Curso', id);
    if (!curso) return;
    document.getElementById('editCurId').value = curso.id_Curso;
    document.getElementById('editCurTitulo').value = curso.titulo;
    document.getElementById('editCurCategoria').value = curso.id_Categoria;
    document.getElementById('editCurInstrutor').value = curso.id_Instrutor;
    document.getElementById('editCurNivel').value = curso.nivel;
    document.getElementById('editCurDesc').value = curso.descricao;

    const modal = new window.bootstrap.Modal(document.getElementById('modalEditarCurso'));
    modal.show();
  }
}
