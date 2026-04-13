import Store from '../models/Store.js';
import Usuario from '../models/Usuario.js';
import UI from '../views/UI.js';
import Router from './Router.js';

export default class AuthController {
  static init() {
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    const formRegister = document.getElementById('formRegister');
    if (formRegister) {
      formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }
  }

  static handleLogin() {
    const emailInput = document.getElementById('loginEmail').value;
    const pwdInput = document.getElementById('loginPassword').value;

    const usuarios = Store.getAll('usuarios');
    const user = usuarios.find(u => u.email === emailInput);

    if (user) {
      const inputHash = btoa(pwdInput);
      if (user.senhaHash === inputHash) {
        Store.setCurrentUser(user);
        UI.showToast('Login realizado com sucesso!', 'success');

        setTimeout(() => {
          let inst = document.getElementById('loginModal');
          if (inst) {
            const bsModal = window.bootstrap.Modal.getInstance(inst);
            if(bsModal) bsModal.hide();
          }

          if (user.perfil === 'Aluno') {
            Router.navigateTo('view-dashboard-user');
          } else {
            Router.navigateTo('view-dashboard-admin');
          }
        }, 1000);
      } else {
        UI.showToast('Senha inválida', 'error');
      }
    } else {
      UI.showToast('Usuário não encontrado', 'error');
    }
  }

  static handleRegister() {
    const nome = document.getElementById('regNome').value;
    const email = document.getElementById('regEmail').value;
    const senha = document.getElementById('regSenha').value;

    const usuarios = Store.getAll('usuarios');
    if (usuarios.find(u => u.email === email)) {
      UI.showToast('Email já está em uso', 'error');
      return;
    }

    const newUser = new Usuario(nome, email, senha, 'Aluno');
    Store.insert('usuarios', newUser);
    Store.setCurrentUser(newUser);

    UI.showToast('Conta criada com sucesso!', 'success');

    setTimeout(() => {
      let inst = document.getElementById('registerModal');
      if (inst) {
        const bsModal = window.bootstrap.Modal.getInstance(inst);
        if(bsModal) bsModal.hide();
      }
      Router.navigateTo('view-dashboard-user');
    }, 1000);
  }

  static logout() {
    Store.setCurrentUser(null);
    Router.navigateTo('view-index');
  }
}
