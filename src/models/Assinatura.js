import { generateId } from './Usuario.js';

export default class Assinatura {
  constructor(id_Usuario, id_Plano) {
    this.id_Assinatura = generateId();
    this.id_Usuario = id_Usuario;
    this.id_Plano = id_Plano;
    this.dataInicio = new Date().toISOString();
    
    this.dataFim = new Date();
    this.dataFim.setMonth(this.dataFim.getMonth() + 1); // Mock 1 mês
    this.dataFim = this.dataFim.toISOString();
  }
}
