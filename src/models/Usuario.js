export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export default class Usuario {
  constructor(nomeCompleto, email, senha, perfil = 'Aluno') {
    this.id_Usuario = generateId();
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.senhaHash = btoa(senha); // Simulação de hash simples
    this.dataCadastro = new Date().toISOString();
    this.perfil = perfil; // 'Admin' ou 'Aluno' ou 'Instrutor'
  }
}
