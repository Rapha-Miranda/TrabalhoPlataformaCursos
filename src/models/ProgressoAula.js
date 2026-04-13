export default class ProgressoAula {
  constructor(id_Usuario, id_Aula) {
    this.id_Usuario = id_Usuario; // PK composta simulada
    this.id_Aula = id_Aula; // PK composta simulada
    this.dataConclusao = new Date().toISOString();
    this.status = 'Concluído';
  }
}
