import { generateId } from './Usuario.js';

export default class Avaliacao {
  constructor(id_Usuario, id_Curso, nota, comentario) {
    this.id_Avaliacao = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Curso = id_Curso;
    this.nota = nota;
    this.comentario = comentario;
    this.dataAvaliacao = new Date().toISOString();
  }
}
