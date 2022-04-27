import { defineStore } from 'pinia';
import axios from 'axios';
import { Grupo } from 'src/components/models';

export const gruposStore = defineStore('grupos', {
  state: () => ({
    grupos: [],
    meusGrupos: [],
    gruposInviteSent: [],
    grupo: {} as Grupo,
  }),
  actions: {
    setGrupoAtual(id_grupo: number) {
      console.log(id_grupo, this.meusGrupos)
      this.grupo = this.meusGrupos.filter(grupo => grupo.id === id_grupo)[0]
      console.log('setGrupo', this.grupo)
    },
    async criaGrupo(grupo, interesses) {
      try{
          await axios.post('http://localhost:3030/grupos', {grupo, interesses})
          this.buscaGrupos()
      }
      catch(err){
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
      console.log(matricula)
      const {data} = await axios.get(`http://localhost:3030/grupos/participante/${matricula}`)
      console.log(data)
      this.meusGrupos = data.map((grupo)=>{
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
      const valores = this.meusGrupos.map(grupo => grupo.id)
      console.log('valores', valores)
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
      this.grupos = this.grupos.filter(grupo => !valores.includes(grupo.id))

    },

    filtraMateriasJaExistentes (materias) {
      const materiasUsadas = this.meusGrupos.map((grupo: Grupo)=>{
          console.log('teste', grupo)
          return grupo.materia
      })
      return materias.filter(materia=>{
        return !materiasUsadas.includes(materia.label)
      })
    },
    filtraGruposById (id: string) {
      return this.grupos.filter(grupo=> grupo.id === parseInt(id))[0]
    },
    async allInvitesSent(matricula: string){
      try{
        const {data} = await axios.get(`http://localhost:3030/grupos/pedido/enviados/${matricula}`)
        console.log('invites', data)
        this.gruposInviteSent = data.map(pedido=>pedido.id_grupo)
      } catch (e) {
        console.error(e)
      }
    },
    async buscaPedidosGrupo(id_grupo) {
      const {data} = await axios.get(`http://localhost:3030/grupos/pedido/recebidos/${id_grupo}`)
      console.log('teste123123',data)
      return data
    },
    async acceptInvite(id_pedido){
      const {data} = await axios.post(`http://localhost:3030/grupos/pedido/${id_pedido}`, {resposta: 1})
      return data
    },
    async rejectInvite(id_pedido){
      const {data} = await axios.post(`http://localhost:3030/grupos/pedido/${id_pedido}`, {resposta: 0})
      return data
    },
    async sendInvite(id_usuario, id_grupo){
      const obj = {pedido: {id_usuario, id_grupo}}
      const {data} = await axios.post('http://localhost:3030/grupos/pedido', obj)
    }
  },
});
