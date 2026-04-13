import Usuario from './Usuario.js';
import Categoria from './Categoria.js';
import Curso from './Curso.js';
import Modulo from './Modulo.js';
import Aula from './Aula.js';
import Plano from './Plano.js';
import Trilha from './Trilha.js';
import TrilhaCurso from './TrilhaCurso.js';

export default class Store {
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

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  static setCurrentUser(user) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  static seedData() {
    console.log("Mocking initial seed data...");

    const admin = new Usuario('Administrador', 'admin@plataforma.com', 'admin123', 'Admin');
    const instrutor = new Usuario('João Instrutor', 'instrutor@plataforma.com', '123456', 'Instrutor');
    const aluno = new Usuario('Maria Aluna', 'aluno@plataforma.com', '123456', 'Aluno');
    this.insert('usuarios', admin);
    this.insert('usuarios', instrutor);
    this.insert('usuarios', aluno);

    const catDev = new Categoria('Desenvolvimento', 'Cursos de programação e tech');
    const catDesign = new Categoria('Design Moderno', 'UI/UX e Ferramentas');
    this.insert('categorias', catDev);
    this.insert('categorias', catDesign);

    const cursoJs = new Curso('JavaScript Avançado', 'Domine Vanilla JS e ES6+', instrutor.id_Usuario, catDev.id_Categoria, 'Avançado');
    const cursoUI = new Curso('Master UI Design', 'Design focado em WOW effect', instrutor.id_Usuario, catDesign.id_Categoria, 'Iniciante');
    this.insert('cursos', cursoJs);
    this.insert('cursos', cursoUI);

    const mod1 = new Modulo(cursoJs.id_Curso, 'Fundamentos ES6+', 1);
    this.insert('modulos', mod1);

    const aula1 = new Aula(mod1.id_Modulo, 'Let, Const e Arrow Functions', 'Vídeo', 'https://video.url', 15, 1);
    const aula2 = new Aula(mod1.id_Modulo, 'Classes em JS', 'Texto', 'https://texto.url', 20, 2);
    this.insert('aulas', aula1);
    this.insert('aulas', aula2);

    const planoBasic = new Plano('Básico', 'Acesso a cursos de nível iniciante.', 29.90, 1);
    const planoPro = new Plano('Pro', 'Acesso ilimitado a todas as trilhas e cursos premium.', 69.90, 1);
    this.insert('planos', planoBasic);
    this.insert('planos', planoPro);

    const trilhaFullstack = new Trilha('Trilha Front-end Master', 'De iniciante a avançado', catDev.id_Categoria);
    this.insert('trilhas', trilhaFullstack);
    this.insert('trilhasCursos', new TrilhaCurso(trilhaFullstack.id_Trilha, cursoUI.id_Curso, 1));
    this.insert('trilhasCursos', new TrilhaCurso(trilhaFullstack.id_Trilha, cursoJs.id_Curso, 2));

    console.log("Mock data loaded.");
  }
}
