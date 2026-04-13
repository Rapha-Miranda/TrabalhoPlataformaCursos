import Store from '../models/Store.js';
import UI from '../views/UI.js';
import CoursePlayerView from '../views/CoursePlayerView.js';
import ProgressoAula from '../models/ProgressoAula.js';
import Certificado from '../models/Certificado.js';
import UserController from './UserController.js';

export default class CoursePlayerController {
  static activeCourseId = null;

  static openCurso(cursoId) {
    this.activeCourseId = cursoId;
    const curso = Store.getById('cursos', 'id_Curso', cursoId);
    if(!curso) return;

    const modulos = Store.getAll('modulos').filter(m => m.id_Curso === cursoId).sort((a, b) => a.ordem - b.ordem);
    const aulasAll = Store.getAll('aulas');
    const user = Store.getCurrentUser();
    const progresso = Store.getAll('progressoAulas');

    CoursePlayerView.openCursoModal(
      curso, 
      modulos, 
      aulasAll, 
      progresso, 
      user,
      (aulaId) => this.viewAula(aulaId),
      (cId) => this.emitirCertificado(user.id_Usuario, cId)
    );
  }

  static viewAula(aulaId) {
    const aula = Store.getById('aulas', 'id_Aula', aulaId);
    if(!aula) return;

    const user = Store.getCurrentUser();
    const progresso = Store.getAll('progressoAulas').find(p => p.id_Aula === aulaId && p.id_Usuario === user.id_Usuario);

    CoursePlayerView.renderAulaContent(aula, !!progresso, (id) => this.marcarAulaConcluida(id));
  }

  static marcarAulaConcluida(aulaId) {
    const user = Store.getCurrentUser();
    Store.insert('progressoAulas', new ProgressoAula(user.id_Usuario, aulaId));
    UI.showToast("Aula concluída!", "success");

    this.openCurso(this.activeCourseId);
    this.viewAula(aulaId);
  }

  static emitirCertificado(userId, cursoId) {
    const certs = Store.getAll('certificados');
    if (!certs.find(c => c.id_Curso === cursoId && c.id_Usuario === userId)) {
      Store.insert('certificados', new Certificado(userId, cursoId, null));
      UI.showToast("Certificado emitido e disponível na aba correspondente!", "success");
      UserController.refreshView(Store.getCurrentUser());
    } else {
      UI.showToast("Você já possui o certificado deste curso.", "warning");
    }
  }
}
