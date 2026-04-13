import { generateId } from './Usuario.js';

export default class Plano {
  constructor(nome, descricao, preco, duracaoMeses) {
    this.id_Plano = generateId();
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.duracaoMeses = duracaoMeses;
  }
}
