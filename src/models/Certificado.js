import { generateId } from './Usuario.js';

export default class Certificado {
  constructor(id_Usuario, id_Curso, id_Trilha = null) {
    this.id_Certificado = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Curso = id_Curso;
    this.id_Trilha = id_Trilha;
    this.codigoVerificacao = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    this.dataEmissao = new Date().toISOString();
  }
}
