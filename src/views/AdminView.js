import UI from './UI.js';

export default class AdminView {
  static renderCategorias(categorias) {
    const table = document.getElementById('tabelaCategorias');
    if (!table) return;
    table.innerHTML = '';
    categorias.forEach(c => {
      table.innerHTML += `<tr><td><small class="text-muted">${c.id_Categoria}</small></td><td>${c.nome}</td><td>${c.descricao}</td></tr>`;
    });
  }

  static renderCursos(cursos, instrutores, categorias, modulos) {
    const table = document.getElementById('tabelaCursos');
    if (!table) return;
    table.innerHTML = '';
    cursos.forEach(c => {
      const catNome = categorias.find(cat => cat.id_Categoria === c.id_Categoria)?.nome || 'N/A';
      const insNome = instrutores.find(u => u.id_Usuario === c.id_Instrutor)?.nomeCompleto || 'N/A';
      const qModulos = modulos.filter(m => m.id_Curso === c.id_Curso).length;

      table.innerHTML += `<tr>
              <td class="fw-bold">${c.titulo}</td>
              <td><span class="badge badge-glass text-info">${c.nivel}</span></td>
              <td>${insNome}</td>
              <td>${catNome}</td>
              <td>
                <button class="btn btn-sm btn-outline-warning me-1 btn-edit-curso" data-id="${c.id_Curso}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-delete-curso" data-id="${c.id_Curso}">Excluir</button>
              </td>
          </tr>`;
    });
  }

  static renderTrilhas(trilhas, categorias) {
    const table = document.getElementById('tabelaTrilhas');
    if (!table) return;
    table.innerHTML = '';
    trilhas.forEach(t => {
      const catNome = categorias.find(cat => cat.id_Categoria === t.id_Categoria)?.nome || 'N/A';
      table.innerHTML += `<tr>
              <td class="fw-bold">${t.titulo}</td>
              <td><span class="badge badge-glass text-info">${catNome}</span></td>
              <td>${t.descricao}</td>
          </tr>`;
    });
  }

  static populateDropdowns(categorias, staffs, cursos) {
    UI.populateSelect('curCategoria', categorias, 'id_Categoria', 'nome');
    UI.populateSelect('triCategoria', categorias, 'id_Categoria', 'nome');
    UI.populateSelect('curInstrutor', staffs, 'id_Usuario', 'nomeCompleto');
    UI.populateSelect('aulaCurso', cursos, 'id_Curso', 'titulo');

    UI.populateSelect('editCurCategoria', categorias, 'id_Categoria', 'nome');
    UI.populateSelect('editCurInstrutor', staffs, 'id_Usuario', 'nomeCompleto');
  }

  static bindCursoEvents(onEdit, onDelete) {
    document.getElementById('tabelaCursos')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-edit-curso')) {
        const id = e.target.getAttribute('data-id');
        onEdit(id);
      } else if (e.target.classList.contains('btn-delete-curso')) {
        const id = e.target.getAttribute('data-id');
        onDelete(id);
      }
    });
  }
}
