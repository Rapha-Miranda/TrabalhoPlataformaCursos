import { generateId } from './Usuario.js';

export default class Categoria {
  constructor(nome, descricao) {
    this.id_Categoria = generateId();
    this.nome = nome;
    this.descricao = descricao;
  }
}
