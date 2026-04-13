import { generateId } from './Usuario.js';

export default class Pagamento {
  constructor(id_Assinatura, valorPago, metodoPagamento) {
    this.id_Pagamento = generateId();
    this.id_Assinatura = id_Assinatura;
    this.valorPago = valorPago;
    this.dataPagamento = new Date().toISOString();
    this.metodoPagamento = metodoPagamento;
    this.id_Transacao_Gateway = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
