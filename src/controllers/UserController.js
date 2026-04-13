import Store from '../models/Store.js';
import UI from '../views/UI.js';
import UserView from '../views/UserView.js';
import Router from './Router.js';
import Matricula from '../models/Matricula.js';
import CoursePlayerController from './CoursePlayerController.js';

export default class UserController {
  static initialized = false;

  static init() {
    const currentUser = Store.getCurrentUser();
    if (!currentUser || currentUser.perfil !== 'Aluno') {
      UI.showToast("Acesso Negado. Esta página é para alunos.", 'error');
      setTimeout(() => { Router.navigateTo('view-index'); }, 2000);
      return;
    }

    const assinaturas = Store.getAll('assinaturas');
    const userAssinatura = assinaturas.find(a => a.id_Usuario === currentUser.id_Usuario);

    if (!userAssinatura) {
      this.autoEnrollMockCourses(currentUser);
    }

    this.refreshView(currentUser);

    if (!this.initialized) {
      UserView.bindCourseClickEvents((cursoId) => {
        CoursePlayerController.openCurso(cursoId);
      });
      this.initialized = true;
    }
  }

  static autoEnrollMockCourses(user) {
    const cursos = Store.getAll('cursos');
    const matriculas = Store.getAll('matriculas');
    cursos.forEach(c => {
      if (!matriculas.find(m => m.id_Curso === c.id_Curso && m.id_Usuario === user.id_Usuario)) {
        Store.insert('matriculas', new Matricula(user.id_Usuario, c.id_Curso));
      }
    });
  }

  static refreshView(user) {
    const matriculas = Store.getAll('matriculas').filter(m => m.id_Usuario === user.id_Usuario);
    const cursos = Store.getAll('cursos');
    const certs = Store.getAll('certificados').filter(c => c.id_Usuario === user.id_Usuario);

    UserView.renderMyCourses(user, matriculas, cursos);
    UserView.renderCertificates(user, certs, cursos);
  }
}
