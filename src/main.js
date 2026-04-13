import Store from './models/Store.js';
import Router from './controllers/Router.js';
import AuthController from './controllers/AuthController.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Database Simulation
  Store.init();

  // Initialize Router
  Router.init();

  // Initialize Global Controllers
  AuthController.init();
});
