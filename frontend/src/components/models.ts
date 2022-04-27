
export interface Materia {
  codigo: string;
  nome: string;
}

export interface User {
  matricula: string;
  senha: string;
}
export interface Turma {
  codigo: string;
  semestre: string;
  horario: string;
  codigo_materia: string;
}
export interface Participante {
  matricula: string;
  nome: string;
  email: string;
  ocupacao: string;
}
export interface Grupo {
  id: number;
  nome: string;
  descricao: string;
  criado_por: string;
  semestre: string;
  turma: string;
  materia: string;
  codigo_materia: string;
  id_imagem: number;
  interesses: object[];
}

export interface Interesse {
  id: number;
  interesse: string;
}