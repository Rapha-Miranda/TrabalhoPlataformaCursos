import { generateId } from './Usuario.js';

export default class Aula {
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
