export default class UI {
  static showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || UI.createToastContainer();
    const toastId = 'toast-' + Date.now();

    let bgClass = 'bg-primary';
    if (type === 'success') bgClass = 'bg-success';
    if (type === 'error') bgClass = 'bg-danger';
    if (type === 'warning') bgClass = 'bg-warning text-dark';

    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body fw-bold">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    
    // We assume bootstrap is available globally in the browser as per index.html
    const bsToast = new window.bootstrap.Toast(toastElement, { delay: 4000 });
    bsToast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  static createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
  }

  static populateSelect(selectId, dataArray, valueKey, labelKey, defaultText = "Selecione...") {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="">${defaultText}</option>`;
    dataArray.forEach(item => {
      const option = document.createElement('option');
      option.value = item[valueKey];
      option.textContent = item[labelKey];
      select.appendChild(option);
    });
  }
}
