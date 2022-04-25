import { defineStore } from 'pinia';
import axios from 'axios';
import { Grupo } from 'src/components/models';

export const gruposStore = defineStore('grupos', {
  state: () => ({
    grupos: [],
    meusGrupos: [],
    grupo: {} as Grupo,
  }),
  actions: {
    async criaGrupo(grupo, interesses) {
      try{
          await axios.post('http://localhost:3030/grupos', {grupo, interesses})
          this.buscaGrupos()
      }
      catch(err){
          throw new Error(err)
          console.log(err)
      }
    },
    async editGrupo(id, grupo) {
      try{
          console.log(grupo)
          await axios.patch(`http://localhost:3030/grupos/${id}`, {...grupo})
          this.buscaGrupos()
      }
      catch(err){
          throw new Error(err)
          console.log(err)
      }
    },
    async buscaMeusGrupos () {
      const {matricula} = JSON.parse(sessionStorage.getItem('userInfo'))
      const {data} = await axios.get(`http://localhost:3030/grupos/participante/${matricula}`)
      console.log('bisca', data)
      this.meusGrupos = data.map((grupo: any)=>{
          console.log(grupo)
          return {
              id: grupo.id_grupo,
              nome: grupo.nome_grupo,
              descricao: grupo.descricao_grupo,
              criado_por: grupo.matricula_criador,
              semestre: grupo.semestre_turma,
              turma: grupo.codigo_turma,
              materia: grupo.nome_materia,
              codigo_materia: grupo.codigo_materia,
              interesses: grupo.interesses,
              id_imagem: grupo.id_imagem
          }
      })

    },
    async buscaGrupos () {
      const {matricula} = JSON.parse(sessionStorage.getItem('userInfo'))
      const {data} = await axios.get('http://localhost:3030/grupos/all')
      console.log('bisca1', data)
      this.grupos = data.map((grupo)=>{
        return {
          id: grupo.id_grupo,
          nome: grupo.nome_grupo,
          descricao: grupo.descricao_grupo,
          criado_por: grupo.grupo_criado_por,
          semestre: grupo.semestre_turma,
          turma: grupo.codigo_turma,
          horario_turma: grupo.horario_turma,
          materia: grupo.nome_materia,
          codigo_materia: grupo.codigo_materia,
          interesses: grupo.interesses,
          id_imagem: grupo.grupo_imagem,
          usuarios: grupo.usuarios
        }
      })

    },

    filtraMateriasJaExistentes (materias) {
      const materiasUsadas = this.grupos.map((grupo: Grupo)=>{
          return grupo.materia
      })
      return materias.filter(materia=>{
        return !materiasUsadas.includes(materia.label)
      })
    },
    filtraGruposById (id: string) {
      return this.grupos.filter(grupo=> grupo.id === parseInt(id))[0]
    },
    async refreshGrupos(){
      const id = this.grupo.id
      await this.buscaGrupos()
      await this.filtraGruposById(id)

    }
  },
});
