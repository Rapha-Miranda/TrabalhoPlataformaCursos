import { generateId } from './Usuario.js';

export default class Trilha {
  constructor(titulo, descricao, id_Categoria) {
    this.id_Trilha = generateId();
    this.titulo = titulo;
    this.descricao = descricao;
    this.id_Categoria = id_Categoria;
  }
}
