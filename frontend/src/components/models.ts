
export interface Materia {
  codigo: string;
  nome: string;
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
export interface Meta {
  totalCount: number;
}
