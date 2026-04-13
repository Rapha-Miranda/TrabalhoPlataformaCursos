import { generateId } from './Usuario.js';

export default class Modulo {
  constructor(id_Curso, titulo, ordem) {
    this.id_Modulo = generateId();
    this.id_Curso = id_Curso;
    this.titulo = titulo;
    this.ordem = ordem;
  }
}
