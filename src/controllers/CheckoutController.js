import Store from '../models/Store.js';
import CheckoutView from '../views/CheckoutView.js';
import Assinatura from '../models/Assinatura.js';
import Pagamento from '../models/Pagamento.js';
import Router from './Router.js';

export default class CheckoutController {
  static selectedPlano = null;

  static init() {
    const user = Store.getCurrentUser();
    const area = document.getElementById('checkoutArea');
    const warning = document.getElementById('checkoutAuthWarning');

    if (!user || user.perfil !== 'Aluno') {
      area.classList.add('d-none');
      warning.classList.remove('d-none');
      return;
    }

    area.classList.remove('d-none');
    warning.classList.add('d-none');

    const planos = Store.getAll('planos');
    CheckoutView.renderPlanos(planos, (id) => this.selectedPlano = id);
    if(planos.length > 0) {
      this.selectedPlano = planos[0].id_Plano;
    }

    const formCheckout = document.getElementById('formCheckout');
    // Prevents multiple bindings if re-navigating
    const newForm = formCheckout.cloneNode(true);
    formCheckout.parentNode.replaceChild(newForm, formCheckout);
    
    newForm.addEventListener('submit', (e) => this.handlePayment(e));
  }

  static handlePayment(e) {
    e.preventDefault();
    if (!this.selectedPlano) return;

    const btn = document.getElementById('btnAssinar');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';
    btn.classList.add('disabled');

    setTimeout(() => {
      const user = Store.getCurrentUser();
      const planoStr = Store.getById('planos', 'id_Plano', this.selectedPlano);

      const assinatura = new Assinatura(user.id_Usuario, this.selectedPlano);
      Store.insert('assinaturas', assinatura);

      const pagamento = new Pagamento(assinatura.id_Assinatura, planoStr.preco, 'Cartão de Crédito');
      Store.insert('pagamentos', pagamento);

      CheckoutView.showSuccess(pagamento.id_Transacao_Gateway);
      
      // Reset button
      btn.innerHTML = 'Finalizar Assinatura';
    }, 1500);
  }
}
