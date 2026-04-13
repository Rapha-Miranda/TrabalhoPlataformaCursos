import { generateId } from './Usuario.js';

export default class Matricula {
  constructor(id_Usuario, id_Curso) {
    this.id_Matricula = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Curso = id_Curso;
    this.dataMatricula = new Date().toISOString();
    this.dataConclusao = null;
  }
}
