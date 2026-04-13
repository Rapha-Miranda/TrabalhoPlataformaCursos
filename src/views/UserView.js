export default class UserView {
  static renderMyCourses(user, matriculas, cursos) {
    const container = document.getElementById('listaCursosEnrolados');
    if (!container) return;
    container.innerHTML = '';

    if (matriculas.length === 0) {
      container.innerHTML = `<p class="text-muted w-100 text-center">Você não tem cursos ativos.</p>`;
      return;
    }

    matriculas.forEach(matricula => {
      const curso = cursos.find(c => c.id_Curso === matricula.id_Curso);
      if (!curso) return;

      const html = `
        <div class="col">
          <div class="card glass-card h-100 cursor-pointer btn-open-curso" data-id="${curso.id_Curso}" style="cursor: pointer;">
            <div class="card-body">
              <span class="badge bg-secondary mb-2">${curso.nivel}</span>
              <h5 class="card-title fw-bold pointer-events-none">${curso.titulo}</h5>
              <p class="card-text text-muted small pointer-events-none">${curso.descricao}</p>
              <button class="btn btn-outline-primary w-100 mt-2 pointer-events-none">Continuar Estudando</button>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
  }

  static renderCertificates(user, certs, cursos) {
    const container = document.getElementById('listaCertificados');
    if (!container) return;
    container.innerHTML = '';

    if (certs.length === 0) {
      container.innerHTML = `<li class="list-group-item bg-transparent text-muted border-0">Nenhum certificado ainda. Continue estudando!</li>`;
      return;
    }

    certs.forEach(cert => {
      const curso = cursos.find(c => c.id_Curso === cert.id_Curso);
      container.insertAdjacentHTML('beforeend', `
         <li class="list-group-item bg-transparent border-0 border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
           <div class="text-start">
             <h6 class="fw-bold m-0 text-light">${curso.titulo}</h6>
             <small class="text-muted">Data: ${new Date(cert.dataEmissao).toLocaleDateString()} | Código SHA: <span class="text-primary font-monospace">${cert.codigoVerificacao}</span></small>
           </div>
           <span class="fs-2 text-warning">🎓</span>
         </li>
      `);
    });
  }

  static bindCourseClickEvents(onCourseClick) {
    document.getElementById('listaCursosEnrolados')?.addEventListener('click', (e) => {
      const card = e.target.closest('.btn-open-curso');
      if (card) {
        const id = card.getAttribute('data-id');
        onCourseClick(id);
      }
    });
  }
}
