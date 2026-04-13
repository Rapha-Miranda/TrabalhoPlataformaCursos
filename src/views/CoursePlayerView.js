export default class CoursePlayerView {
  static openCursoModal(curso, modulos, aulasAll, progresso, user, onAulaClick, onEmitirCertificado) {
    document.getElementById('salaCursoTitulo').textContent = curso.titulo;
    const accordion = document.getElementById('modulosAccordion');
    accordion.innerHTML = '';

    let totalAulas = 0;
    let concluidas = 0;

    modulos.forEach((modulo, index) => {
      const aulasDoModulo = aulasAll.filter(a => a.id_Modulo === modulo.id_Modulo).sort((a, b) => a.ordem - b.ordem);

      let aulasHtml = '';
      aulasDoModulo.forEach(aula => {
        totalAulas++;
        const isConcluida = progresso.some(p => p.id_Aula === aula.id_Aula && p.id_Usuario === user.id_Usuario);
        if (isConcluida) concluidas++;

        const checkIcon = isConcluida ? '✅' : '⏳';
        aulasHtml += `
          <button class="list-group-item list-group-item-action bg-transparent text-light border-0 py-2 d-flex justify-content-between align-items-center btn-view-aula" data-id="${aula.id_Aula}">
            <span>${checkIcon} ${aula.ordem}. ${aula.titulo}</span>
            <span class="badge bg-dark">${aula.tipoConteudo}</span>
          </button>
        `;
      });

      const isFirst = index === 0 ? 'show' : '';
      const collapseButtonClass = index === 0 ? '' : 'collapsed';

      const render = `
        <div class="accordion-item bg-transparent border-0 mb-2 border-bottom" style="border-color: rgba(255,255,255,0.1) !important;">
          <h2 class="accordion-header">
            <button class="accordion-button ${collapseButtonClass} bg-transparent text-light fw-bold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMod${index}">
              Módulo ${modulo.ordem}: ${modulo.titulo}
            </button>
          </h2>
          <div id="collapseMod${index}" class="accordion-collapse collapse ${isFirst}" data-bs-parent="#modulosAccordion">
            <div class="accordion-body p-0 pt-2">
              <div class="list-group list-group-flush rounded-0">
                 ${aulasHtml}
              </div>
            </div>
          </div>
        </div>
      `;
      accordion.insertAdjacentHTML('beforeend', render);
    });

    const perc = totalAulas === 0 ? 0 : Math.round((concluidas / totalAulas) * 100);
    document.getElementById('cursoProgressoPercent').textContent = `${perc}%`;
    document.getElementById('cursoProgressBar').style.width = `${perc}%`;

    const btnCert = document.getElementById('btnEmitirCertificado');
    
    // Clean old event listeners mapping
    const newBtnCert = btnCert.cloneNode(true);
    btnCert.parentNode.replaceChild(newBtnCert, btnCert);

    if (totalAulas > 0 && perc === 100) {
      newBtnCert.classList.remove('d-none');
      newBtnCert.addEventListener('click', () => {
        onEmitirCertificado(curso.id_Curso);
      });
    } else {
      newBtnCert.classList.add('d-none');
    }

    // Bind event for aulas inside this modal execution so it doesnt duplicate
    accordion.onclick = (e) => {
      const btnAula = e.target.closest('.btn-view-aula');
      if (btnAula) {
        const id = btnAula.getAttribute('data-id');
        onAulaClick(id);
      }
    };

    const modal = new window.bootstrap.Modal(document.getElementById('salaAulaModal'));
    modal.show();
  }

  static renderAulaContent(aula, isConcluida, onMarcarConcluida) {
    const visor = document.getElementById('aulaVisor');
    let playerHtml = '';
    
    if (aula.tipoConteudo === 'Vídeo') {
      let ytId = null;
      if (aula.url_Conteudo) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = aula.url_Conteudo.match(regExp);
        if (match && match[2].length === 11) {
          ytId = match[2];
        } else if (aula.url_Conteudo.length === 11) {
          ytId = aula.url_Conteudo;
        }
      }
      if (!ytId) {
        const randomYoutubeIds = ['AwGdivC83t8', 'E0jI0wkX5pk', 'FCTFRpXdgEw', 'VW1kAd4Acr4'];
        ytId = randomYoutubeIds[Math.floor(Math.random() * randomYoutubeIds.length)];
      }

      playerHtml = `
        <div class="bg-dark w-100 rounded d-flex align-items-center justify-content-center" style="height: 400px; border: 2px dashed rgba(255,255,255,0.2); overflow: hidden;">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytId}?autoplay=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;
    } else {
      playerHtml = `
        <div class="bg-dark p-4 rounded text-start" style="min-height: 400px; border: 1px solid rgba(255,255,255,0.1);">
           <h5 class="fw-bold mb-3">Material de Leitura</h5>
           <p class="text-muted">Lendo conteúdo de: ${aula.url_Conteudo}</p>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>`;
    }

    const btnHtml = isConcluida
      ? `<button class="btn btn-secondary mt-4 w-100 disabled">Aula Concluída ✅</button>`
      : `<button class="btn btn-gradient mt-4 w-100" id="btnMarcarConcluida">Marcar como Concluída</button>`;

    visor.innerHTML = `
      <h3 class="fw-bold text-start mb-4">${aula.titulo}</h3>
      ${playerHtml}
      ${btnHtml}
    `;

    if (!isConcluida) {
      document.getElementById('btnMarcarConcluida').addEventListener('click', () => {
        onMarcarConcluida(aula.id_Aula);
      });
    }
  }
}
