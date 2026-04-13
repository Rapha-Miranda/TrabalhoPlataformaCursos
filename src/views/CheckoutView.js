export default class CheckoutView {
  static renderPlanos(planos, onSelect) {
    const container = document.getElementById('planosSelectGroup');
    if (!container) return;
    container.innerHTML = '';

    planos.forEach((p, index) => {
      const isSelected = index === 0 ? 'bg-primary bg-opacity-25 border-primary active-plan' : 'bg-transparent';
      
      container.innerHTML += `
          <label class="list-group-item list-group-item-action cursor-pointer rounded mb-3 glass-card btn-select-plano ${isSelected}" data-id="${p.id_Plano}" data-preco="${p.preco}" style="cursor: pointer;">
              <div class="d-flex w-100 justify-content-between text-light pointer-events-none">
                 <h5 class="mb-1 fw-bold">${p.nome}</h5>
                 <small class="fs-5 pb-0 m-0">R$ ${p.preco.toFixed(2)}</small>
              </div>
              <p class="mb-1 text-muted pointer-events-none">${p.descricao}</p>
          </label>
          `;
    });

    document.getElementById('planosSelectGroup').addEventListener('click', (e) => {
      const label = e.target.closest('.btn-select-plano');
      if (label) {
        const id = label.getAttribute('data-id');
        const preco = parseFloat(label.getAttribute('data-preco'));
        this.updateSelectionUI(id, preco);
        if (onSelect) onSelect(id, preco);
      }
    });
  }

  static updateSelectionUI(id, preco) {
    document.querySelectorAll('.btn-select-plano').forEach(el => {
      el.classList.remove('bg-primary', 'bg-opacity-25', 'border-primary', 'active-plan');
      el.classList.add('bg-transparent');
    });

    const activeEl = document.querySelector(`.btn-select-plano[data-id="${id}"]`);
    if (activeEl) {
      activeEl.classList.remove('bg-transparent');
      activeEl.classList.add('bg-primary', 'bg-opacity-25', 'border-primary', 'active-plan');
    }

    document.getElementById('priceDisplay').textContent = `R$ ${preco.toFixed(2)}`;
    document.getElementById('btnAssinar').classList.remove('disabled');
  }

  static showSuccess(txnId) {
    document.getElementById('txnIdDisplay').textContent = txnId;
    const sM = new window.bootstrap.Modal(document.getElementById('successModal'));
    sM.show();
  }
}
