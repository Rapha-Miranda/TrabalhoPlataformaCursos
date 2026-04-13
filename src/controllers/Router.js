import Store from '../models/Store.js';
import AuthController from './AuthController.js';
import AdminController from './AdminController.js';
import UserController from './UserController.js';
import CheckoutController from './CheckoutController.js';

export default class Router {
  static init() {
    this.setupNavbarListeners();
    this.navigateTo('view-index');
  }

  static setupNavbarListeners() {
    document.querySelectorAll('.navbar-brand, .btn-link-index').forEach(brand => {
      brand.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('view-index');
      });
    });

    document.querySelectorAll('.btn-link-dashboard-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('view-dashboard-user');
      });
    });
  }

  static setupNavigation(user) {
    const navRights = document.querySelectorAll('.nav-right');
    if (navRights.length === 0) return;

    navRights.forEach((navRight) => {
      if (user) {
        const dashboardView = user.perfil === 'Aluno' ? "view-dashboard-user" : "view-dashboard-admin";
        navRight.innerHTML = `
          <span class="nav-link">Olá, <b>${user.nomeCompleto.split(' ')[0]}</b></span>
          <button id="btnNavMeuDashboard" class="btn btn-outline-primary ms-2 btn-sm">Meu Dashboard</button>
          <button id="btnNavSair" class="btn btn-light ms-2 btn-sm text-dark">Sair</button>
        `;
        
        document.getElementById('btnNavMeuDashboard')?.addEventListener('click', () => {
          this.navigateTo(dashboardView);
        });

        document.getElementById('btnNavSair')?.addEventListener('click', () => {
          AuthController.logout();
        });
      } else {
        navRight.innerHTML = `
          <button type="button" class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal"> Entrar </button>
          <button id="btnNavAssinar" class="btn btn-gradient"> Assinar Agora </button>
        `;

        document.getElementById('btnNavAssinar')?.addEventListener('click', () => {
          this.navigateTo('view-checkout');
        });
      }
    });

    // Also update any inline checkout links in index page without using inline onclick
    document.querySelectorAll('.btn-link-checkout, [onclick="navigateTo(\'view-checkout\'); return false;"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        this.navigateTo('view-checkout');
      };
    });
  }

  static navigateTo(viewId) {
    document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);

    const currentUser = Store.getCurrentUser();
    this.setupNavigation(currentUser);

    // Call individual controllers based on view
    if (viewId === 'view-dashboard-admin') {
      AdminController.init();
    } else if (viewId === 'view-dashboard-user') {
      UserController.init();
    } else if (viewId === 'view-checkout') {
      CheckoutController.init();
    }
  }
}
