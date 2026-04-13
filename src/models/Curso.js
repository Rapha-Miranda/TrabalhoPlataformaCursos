import { generateId } from './Usuario.js';

export default class Curso {
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
